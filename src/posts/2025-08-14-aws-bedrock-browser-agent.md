---
layout: layouts/post.njk
date: 2025-08-14
tags: 
  - posts
title: "Browse to Break: Productionizing Agentic ASM on AWS with Bedrock & Strands"
description: "In this post we deep dive into the design and deployment of an Attack Surface Management agent built on Strands Agents, Amazon Bedrock, AgentCore, and Knowledge Bases"
---

${toc}

Ever wondered how "much" internet we have? While (as usually) the answer depends on "how do you want to measure it", according to [Netcraft](https://www.netcraft.com/blog/june-2025-web-server-survey) we have about 1.25 billion websites (June 2025). Statista estimates that we created, consumed and stored [149 zettabytes in 2024](https://www.statista.com/statistics/871513/worldwide-data-created/). That's 149 sextillion bytes (149,000,000,000,000,000,000,000 bytes), 149 000 exabytes or 149 billion terabytes. **A. lot. of. data.**

Full table of contents:
- [TLDR;](#tldr%3B-🎯)
- [What we built](#what-we-built)
  - [The complete tech stack](#the-complete-tech-stack)
- [Diving deeper: building blocks](#diving-deeper-building-blocks-🔍)
  - [Agent framework: Strands Agents](#agent-framework-strands-agents)
  - [(Reasoning) models](#(reasoning)-models-🧠)
  - [Tool use and Model Context Protocol (MCP)](#tool-use-and-model-context-protocol-(mcp)-🛠️)
    - [Playwright](#playwright)
    - [Filesystem](#filesystem)
  - [Grounding and retrieval-augmented generation (RAG)](#grounding-and-retrieval-augmented-generation-(rag)-📚)
  - [Productionising the whole thing](#productionising-the-whole-thing-🚀)
    - [Deployment](#deployment)
    - [Observability and evaluation](#observability-and-evaluation-📊)
- [Conclusion and future work](#conclusion-and-future-work-🎬)
  - [Conclusion](#conclusion)
  - [Future work](#future-work)

How much of that data is consumed by us, the flesh and blood human, you ask? Well, since 2024, you'll be happy to hear, less than half! Bot traffic accounted for 51% of all web traffic, according to [2025's Imperva Bad Bot Report](https://www.thalesgroup.com/en/worldwide/defence-and-security/press_release/artificial-intelligence-fuels-rise-hard-detect-bots). Malicious bots made up 37% of all traffic.

And how does the internet consume "us", humans? According to the [Digital 2025 flagship report](https://datareportal.com/reports/digital-2025-global-overview-report), the average user spends 6 hours and 38 minutes on the internet each day. Combining that with 5.56 billion internet users (see [page 52](https://indd.adobe.com/view/9d9a68f6-38a9-4278-b61c-4506b24240b0?startpage=52)), that means over 36 billion human‑hours/day. **A. lot. of. time.**

<div style="text-align: center;">
<iframe style="border: 1px solid #777;" src="https://indd.adobe.com/embed/9d9a68f6-38a9-4278-b61c-4506b24240b0?startpage=69&allowFullscreen=true" width="525px" height="371px" frameborder="0" allowfullscreen=""></iframe>
</div>

But before we get distracted, back to the topic of the day: bots and (malicious) internet users. One of our customers at [DoiT](http://doit.com/expertise) I have the pleasure working with is active within the cybersecurity market. In their activities, they concentrate on Attack Surface Management (ASM) in which discovering a client's digital publicly exposed assets is a key activity. As part of our engagement, we looked at applying the AWS latest technologies to help them on their mission of protecting their clients. Having humans manually navigating this vast and dynamic attack surface is an impossible task. This is where autonomous AI agents come in as they can tirelessly explore digital assets, mimicking human researchers but at a machine's scale and speed.

# TLDR; 🎯

In this article, I'll walk through how we built a production-ready Attack Surface Management (ASM) agent that can autonomously browse the web to discover and analyse security vulnerabilities. We'll explore:

- The complete architecture combining **AWS Bedrock**, **Strands Agents**, **Model Context Protocol (MCP)**, and **Bedrock AgentCore**
- Deep-dive into agent frameworks, reasoning models, and the latest in agentic AI patterns
- How to equip agents with tools (browser automation via Playwright/AgentCore, filesystem operations via MCP)
- Grounding your agent with external knowledge using **Bedrock Knowledge Bases** and the **CVE database**
- Deploying to production with **AWS Fargate** and the new managed **Bedrock AgentCore** runtime
- Observability and monitoring through **Langfuse** and **CloudWatch**

The code is available on [GitHub](https://github.com/matthiasa4/aws-bedrock-browser-use).

# What we built

We looked at Agent definitions in [my previous blogpost](https://matthiasbaetens.com/posts/2025-07-20-adk/#ai-agents), and AWS also includes a definition in their [docs](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/agents/agent-loop/), in this case for "Agent Loop":

> The agent loop is a core concept in the Strands Agents SDK that enables intelligent, autonomous behavior through a cycle of reasoning, tool use, and response generation. 

A bit more wordy, but the essence remains the same. In our case the flow looked something like this:

<div style="text-align: center;">
  <img src="/images/2025-08-14-aws-bedrock-browser-agents/agentic-loop.svg" 
       alt="Architecture diagram" 
       style="max-width: 100%; height: auto;">
</div>

In this post, I'll explore how we helped our customer with an AI agent that can actually browse the web, look at the architecture needed for doing so on AWS, take a closer look at Strands Agents (and do some comparisons with ADK here and there), and how to deploy all of this to production.

## The complete tech stack

The different components making up the whole application are:

| Component | Technology | Description |
|-----------|------------|-------------|
| **Foundation Model** | [Amazon Bedrock](https://aws.amazon.com/bedrock) | Managed service providing access to 100s of large language models |
| **Agent Framework** | [Strands Agents](https://strandsagents.com) | SDK for building and deploying production-ready, multi-agent AI systems |
| **Tooling** | [Model Context Protocol (MCP)](https://modelcontextprotocol.io) | Open protocol for connecting LLMs to external tools and data sources |
| **Retrieval** | [OpenSearch via Amazon Bedrock Knowledge Base](https://aws.amazon.com/bedrock/knowledge-bases) | Vector store for semantic search and retrieval-augmented generation (RAG) |
| **Runtime** | [AWS Fargate](https://aws.amazon.com/fargate/), [Amazon Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/) | Serverless platform for running (agent) workloads without infrastructure management |
| **Infrastructure as Code** | [AWS CDK](https://aws.amazon.com/cdk/) | Cloud Development Kit for defining cloud infrastructure using familiar programming languages |
| **Observability** | [LangFuse](https://langfuse.com/) | Open-source platform for monitoring and evaluating LLM applications |

But what would a good blogpost be without a nice architecture diagram?

<div style="text-align: center;">
  <img src="/images/2025-08-14-aws-bedrock-browser-agents/bedrock_browser_agent_architecture.png" 
       alt="Architecture diagram" 
       style="max-width: 100%; height: auto;">
</div>

Protip: checkout my colleagues [article](https://engineering.doit.com/building-aws-architecture-with-mcp-servers-and-strands-agents-e53bd163962f) on using Strands and MCP to generate your diagram!

But without further ado, let's dive one level deeper into each of these components!

# Diving deeper: building blocks 🔍

<!-- We want to build the section around the solution: adding components working back from what we wanted to achieve -->

Let's work our way through the problem working back from what we want to deliver: an LLM-driven agent that goes out to a given domain, discovers what is exposed, and looks for what is prone to an attack.

## Agent framework: Strands Agents

I started building with [InlineAgents](https://aws.amazon.com/about-aws/whats-new/2024/11/inlineagents-agents-amazon-bedrock/) which was announced end of 2024. But documentation and support seemed rather thin and buried inside the [samples repo](https://github.com/awslabs/amazon-bedrock-agent-samples/blob/4cd8ad82f2d1e5ba357fd8d53c8fa4afdf7acf74/src/InlineAgent/src/InlineAgent/agent/inline_agent.py#L35) and around the same time the [first version of Strands Agents](https://github.com/strands-agents/sdk-python/releases/tag/v0.1.0) was released. Given it had more documentation and seemingly investment as well, it seemed like the healthier choice. Included in that were clear pathways to deployment and a clear focus on observability and evaluation.

In the meantime Strands Agents has evolved beyond the [v1.0](https://aws.amazon.com/blogs/opensource/introducing-strands-agents-1-0-production-ready-multi-agent-orchestration-made-simple/) launch in mid-July and has a flashy website. But it comes with a lot of goodies - I'll highlight a few that jumped out to me in this section and throughout the sections to follow where appropriate.

Like ADK, Strands Agents keeps track of your conversation history through `messages` (`events` in ADK) and maintains `state` (as key-value storage). Persistence is available through `FileSessionManager` and `S3SessionManager` for local or remote storage respectively. ADK provides similar options through their [`MemoryService`](https://google.github.io/adk-docs/sessions/memory/) with an in-memory and remote implementation.

Something where the two frameworks diverge is tools to do context engineering. As I discussed in the [ADK post](https://matthiasbaetens.com/posts/2025-07-20-adk/#context-engineering-%E2%9A%99%EF%B8%8F), as history grows, managing context becomes increasingly important. While still missing in ADK at the time of writing, Strands Agents comes packed with `SlidingWindowConversationManager` by default which will purge a fixed number of recent messages. More interesting though is the `SummarizingConversationManager` which will summarise your context with the help of an LLM and is fully configurable. For the adventurous among us, there's the option to implement an `apply_management` (running at the end of each agent cycle) and `reduce_context` (running when your context window is exceeded) function in your own `ConversationManager`. Head to the [docs](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/agents/conversation-management/#conversation-management) to learn more!

More customisation is possible in both frameworks through what is called [`hooks`](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/agents/hooks/) in Strands Agents and [`callbacks`](https://google.github.io/adk-docs/callbacks/) in ADK. As we know, an agent is an event-driven system, and essentially, it allows you to plug-in some custom code everytime a certain event takes place. Strands defined slightly more events than ADK: [8](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/agents/hooks/#available-events) vs [6](https://google.github.io/adk-docs/callbacks/#the-callback-mechanism-interception-and-control).

In the multi-agent area, Strands also supports Agent2Agent (A2A) protocol and Agents as Tools. The latter is implemented just through wrapping your agent with the `@tool` decorator, while in ADK you will use `AgentTool` class. While ADK provides you with a set of [common patterns](https://google.github.io/adk-docs/agents/multi-agents/#common-multi-agent-patterns-using-adk-primitives), Strands gives you `Graph` (with [recommended topologies](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/multi-agent/graph/#common-graph-topologies)) and `Swarm` (autonomous coordination) primitives to work with. A point of confusion in this area are the [Workflow Agents](https://google.github.io/adk-docs/agents/workflow-agents/) and Agent Workflows. While in ADK it means introducing more determinism into your execution flow, AWS documentation talks about:

> An agent workflow is a structured coordination of tasks across multiple AI agents, where each agent performs specialized functions in a defined sequence or pattern

Seemingly, the documentation talks about a workflow as a sequence of tasks (which in my head would make it an instance of a `Graph`), but later on in the documentation a Workflow Tool gets introduced which looks more like a [dynamic task scheduling system](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/multi-agent/workflow/#quick-start-with-the-workflow-tool). I hope this part [gets clarified](https://github.com/strands-agents/sdk-python/issues/972) in the documentation soon.

Overall, Strands Agents seems a solid choice if your infrastructure is AWS heavy, as pointed out in [AWS own comparison and considerations page](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-frameworks/comparing-agentic-ai-frameworks.html#:~:text=AWS%20infrastructure%20integration,(AWS%20Blog).).

## (Reasoning) models 🧠

But before we digress too far from our initial goal, let's talk about the other components of our architecture, starting with the brain of our agent. The ability of this brain to "think" or "reason" has evolved rapidly.

As mentioned in my [last post](https://matthiasbaetens.com/posts/2025-07-20-adk/#reasoning-models-and-gemini), Andrej Karpathy has a [great video](https://www.youtube.com/watch?v=7xTGNNLPyMI) on how modern LLM systems are created. While a thorough literature review would have me digress too far again (and I hope to deep-dive on this in another post at some point), I'll give a quick overview of my current understanding.

The first step came when we started prompting LLMs to produce "reasoning traces" before giving an answer, achieving state-of-the-art results: [Chain-of-Thought (CoT) prompting](https://arxiv.org/abs/2201.11903). This technique got taken further with [Tree of Thoughts (ToT)](https://arxiv.org/abs/2305.10601) in which multiple reasoning paths were considered, and [Graph of Thoughts (GoT)](https://arxiv.org/abs/2308.09687), in which reasoning is modelled as a graph in which thoughts are vertices and relations are edges, enabling merging of related thoughts, feedback loops, showing stronger global reasoning and cost reduction. In other work [from Google](https://arxiv.org/abs/2112.00114), LLMs get asked to output intermediary steps (not unlike a scratchpad), or generate multiple reasoning paths after which the most consistent one get chosen by majority vote ([Self-Consistency Improves Chain of Thought Reasoning in Language Models](https://arxiv.org/abs/2203.11171)). [From University of Washington](https://arxiv.org/abs/2210.03350), the model asks itself questions, further improving results.

These methods help surface the reasoning abilities latent in pre-trained models. But to actually improve reasoning quality, researchers started teaching models how to reason better. [OpenAI](https://arxiv.org/abs/2305.20050) showed that process supervision (feedback for each intermediate step) improves performance, and mention it in the [release blogpost](https://openai.com/index/learning-to-reason-with-llms/) of their first reasoning model `o1` about a year ago, while [Google](https://arxiv.org/abs/2203.14465) lets a model improve itself by learning from its own generated reasoning. The [DeepSeek](https://arxiv.org/abs/2501.12948) team showed that emergent reasoning behaviour is possible through reinforcement learning alone.

Apart from thinking, an agent also needs to be able to "do stuff". That's where [ReAct](https://arxiv.org/abs/2210.03629) comes in, a very important paper in the advent of agents, where LLMs were asked to generate both reasoning traces and actions in an interleaved manner (which is essentially the agentic loop). In related work [Meta AI](https://arxiv.org/abs/2302.04761) proposed `ToolFormer`, where an LLM was trained to decide which tools to use when in a self-supervised way.

All of the above (and probably a lot more) enables us to program a simple agent with a few lines of Python code, like I did for our ASM agent:

```python
  all_tools = [retrieve]

  with playwright_mcp_client, filesystem_mcp_client:
      playwright_tools = playwright_mcp_client.list_tools_sync()
      filesystem_tools = filesystem_mcp_client.list_tools_sync()

      all_tools.extend(playwright_tools + filesystem_tools)

      agent = Agent(
          model=bedrock_model,
          system_prompt=system_prompt,
          tools=all_tools,
      )
```

As the attentive reader might have spotted in the above code, I used a variable named `bedrock_model`, which means - YOU MIGHT HAVE GUESSED IT - the model I used was hosted on Amazon Bedrock. Strands Agents has a big section on "Model Providers" ranging from the popular closed and open models (OpenAI, Anthropic, MistralAI, Llama API, ...) to tooling to run models locally (llama.cpp, Ollama, ...). Since the customer was already using AWS and Bedrock provides easy access to the state-of-the-art foundation models from leading providers through a unified API, it was a no-brainer to start here.

Now that we have a reasoning brain for our agent, we need to give it hands - the tools it needs to actually interact with the web and gather information.

## Tool use and Model Context Protocol (MCP) 🛠️

While Strands Agents follows a [model-first design](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-frameworks/strands-agents.html#:~:text=following%20key%20features%3A-,Model%2Dfirst%20design,-%E2%80%93%20Built%20around%20the), tools still play a central role in being able to act and in grounding the model as part of fulfilling the agent's goal.

This works through a [tool registry](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/agents/agent-loop/#:~:text=Creates%20a%20tool%20registry%20and%20registers%20tools) that gets initialised at agent creation time. Defining which tools are available to the agent is as simple as [passing a list](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/tools/tools_overview/#:~:text=tools%3D%5Bcalculator%2C%20file_read%2C%20shell%5D) as you can see in my agent definition above.

Strands supports a multitude of tools:
- Python tools (most commonly through decorator)
- Through MCP (see below for more)
- A huge list of [community tools](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/tools/community-tools-package/). In building the agent, we used the `retrieve`, and later on the AgentCore Browser. Another personal highlight for me is the [handoff_to_user](https://aws.amazon.com/blogs/opensource/introducing-strands-agents-1-0-production-ready-multi-agent-orchestration-made-simple/#:~:text=a%20built%2Din-,handoff_to_user,-tool%20that%20agents) tool in case you want to get a human-in-the-loop ([also in ADK since v1.14](https://medium.com/google-cloud/2-minute-adk-human-in-the-loop-made-easy-da9e74d9845a)).

As the documentation points out:

> Language models rely heavily on tool descriptions to determine when and how to use them. Well-crafted descriptions significantly improve tool usage accuracy.

We can inspect such examples by looking at the source code, e.g. for [`retrieve`](https://github.com/strands-agents/tools/blob/b65dd11eb92e513a76ff4a37ed170aefaa664d41/src/strands_tools/retrieve.py#L217) if we need inspiration for our own tools. In case of using tools through MCP, like we did e.g. for the `filesystem` tools, we need to take a look at the [server implementation](https://github.com/modelcontextprotocol/servers/blob/05b082297cb13818f72b8dd0cd444d48851db5c8/src/filesystem/index.ts#L190). It's always good to take a look to avoid [Tool Poisoning Attacks](https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks)

Bear in mind that it is best practice to explicitly limit the tools to only the ones you need. All the information (tool description, schema, ...) get passed to the LLM on each invocation, growing your context window. It also avoids letting your agent suddenly start calling tools that were added to the MCP server after you initially defined the agent, leading to potential vulnerabilities. See also Drew Breunig's great article on "How to Fix Your Context", specifically the section about [Tool Loadout](https://www.dbreunig.com/2025/06/26/how-to-fix-your-context.html#tool-loadout)

You are able to specify an [execution strategy for your tools](https://strandsagents.com/latest/documentation/docs/user-guide/concepts/tools/executors/#concurrent-executor) as well: by default, tools get executed in parallel, but that can be changed to sequential.

As you might have spotted, we used two [MCP servers](https://matthiasbaetens.com/posts/2025-07-20-adk/#model-context-protocol-(mcp)) which we'll discuss in the next two subsections. We also used the `retrieve` tool, which we'll discuss in the next section.

### Playwright

Microsoft has open sourced an [MCP for Playwright](https://github.com/microsoft/playwright-mcp). When I initially start experimenting for this project, I ran into the [Browser Use](https://browser-use.com) project, and they were using (an adapted version of) Playwright, so I figured it was a good place to start.

But why not simple `cURLs` you ask. When we use a full browser, we get the full experience that comes with JavaScript execution: dynamically loaded content, user interaction and backend communication, getting the complete picture of the web application functionality (and potential vulnerabilities). It allows us to simulate user interactions like logging in, navigating through clicking buttons and submitting data through filling out forms. Through these interactions, we can uncover assets not present in HTML. On top of that, we can browse statefully, handling sessions and cookies.

It comes with the option to browse headed, which is great during the initial development to see how your agent is behaving. Once we gained some confidence and are ready to deploy to production, a headless configuration might suffice.

At the start of August however, [AWS announced Amazon Bedrock AgentCore](https://aws.amazon.com/blogs/aws/introducing-amazon-bedrock-agentcore-securely-deploy-and-operate-ai-agents-at-any-scale/) which comes with its own [Browser Tool](https://aws.amazon.com/blogs/machine-learning/introducing-amazon-bedrock-agentcore-browser-tool), making my life even easier. It provides a zero-management browser solution, that can scale easily, runs in an isolated environment (which wasn't the case in my first architecture), and integration with several AWS services like IAM, CloudTrail, and CloudWatch for access management, tracking, and monitoring. Lucky enough, I was able to update the code to use this with minimal changes:

```python
# importing the new tool
from strands_tools.browser.agent_core_browser import AgentCoreBrowser

# updating the list of tools from MCP to AgentCoreBrowser
all_tools = [retrieve, AgentCoreBrowser().browser]
```

### Filesystem

To keep track of pages visited, actions tried, and vulnerabilities found, I decided to use the `filesystem` MCP for filesystem operations that is part of the [modelcontextprotocol](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) repo. There are probably more robust solutions for state management, but for a first implementation this did the trick. I provided some guidance on where to keep track of state, what to save in our "security findings database" and how to keep track of the state of interactions in the system prompt, as well as a stopping condition.

## Grounding and retrieval-augmented generation (RAG) 📚

In order to keep our agent's knowledge up-to-date with the latest and greatest in the security landscape like newly discovered vulnerabilities, we decided to equip it with a database of known vulnerabilities. We demonstrated this through grounding the model in the "Common Vulnerabilities and Exposures" database which is open source available in the [CVE Project repository](https://github.com/CVEProject/cvelistV5.git). Through enabling our agent with the `retrieve` tool, we enabled it to rely on external and up-to-date knowledge queried at runtime.

For this, we leaned on [Amazon Bedrock Knowledge Bases](https://aws.amazon.com/bedrock/knowledge-bases/), a service that helps a lot with the heavy-lifting setting up such workflows: it takes care of parsing, chunking, and embedding your data, and serves the relevant data to your agent. It's backed by OpenSearch Serverless, Pinecone, Redis, MongoDB, Aurora, as well as the recently announced [S3 Vectors](https://aws.amazon.com/blogs/aws/introducing-amazon-s3-vectors-first-cloud-storage-with-native-vector-support-at-scale/).

We did some pre-processing to filter out irrelevant vulnerabilities and split the files to cope with Bedrock Knowledge Bases' 50MB file size limit - more on that in the [repo](https://github.com/matthiasa4/aws-bedrock-browser-use/tree/main/data/knowledge-base).

With our agent now capable of accessing knowledge and storing findings, the next challenge was taking it from a local development environment to a production-ready system that could operate reliably at scale.

## Productionising the whole thing 🚀

The teams behind [Amazon Q Developer and AWS Glue](https://aws.amazon.com/blogs/opensource/introducing-strands-agents-1-0-production-ready-multi-agent-orchestration-made-simple/#:~:text=in%20production%20by%20Amazon%20teams%20like%20Amazon%20Q%20Developer%20and%20AWS%20Glue) have been using Strands Agents in production for a while, so why wouldn't we? Let's look at how we brought this whole set-up from local to the cloud.

### Deployment

For deployment, the options in the documentation are heavily AWS biased (think EC2, EKS, Fargate, Lambda) as also highlighted in the [agent framework comparison](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-frameworks/comparing-agentic-ai-frameworks.html#:~:text=Strands%20Agents-,Strongest,-Strong), but I believe deployment shouldn't be an issue on different clouds with similar offerings (at the end of the day we are just looking for memory and compute cycles). However, we wanted to stay within the AWS ecosystem since that's where our customer is, and for that reason experimented with two of the most scalable and managed solutions on offer: Fargate and Bedrock AgentCore. 

Fargate is AWS version of "bring your container and forget about servers and scaling", hence you will find a [Dockerfile](https://github.com/matthiasa4/aws-bedrock-browser-use/blob/main/Dockerfile) in the repo. It installs the necessary dependencies, including the MCP servers and browser dependencies. I included a [`docker-compose`](https://github.com/matthiasa4/aws-bedrock-browser-use/blob/main/docker-compose.yml) as well to test locally. Once you're happy, you'll want to push them to ECR ([Elastic Container Registry](https://aws.amazon.com/ecr/)). There is a [`cdk` folder](https://github.com/matthiasa4/aws-bedrock-browser-use/tree/main/cdk) taking care of setting up the necessary infrastructure (think Fargate Service, Load Balancer, VPC, IAM roles etc) and I recommend taking a look at the [README](https://github.com/matthiasa4/aws-bedrock-browser-use/blob/main/cdk/README.md) for more information.

The other option is through a relatively recent adition to the Bedrock suite of products: [AgentCore](https://www.aboutamazon.com/news/aws/aws-summit-agentic-ai-innovations-2025). With relatively [few code changes](https://github.com/matthiasa4/aws-bedrock-browser-use/commit/b0a27989d9a63e223ee98a39a24d158422ab95a8), we managed to replace the Playwright browser with the AgentCore managed browser which illustrates the composability and building blocks Strands Agents gives you brilliantly. 

AWS also opensourced a [starter toolkit for AgentCore](https://github.com/aws/bedrock-agentcore-starter-toolkit). With a simple `agentcore configure` and `agentcore launch` you're off to the races (or should I say cloud?). Check out the [AgentCore Runtime Quickstart](https://aws.github.io/bedrock-agentcore-starter-toolkit/user-guide/runtime/quickstart.html#step-4-configure-your-agent). In order for me to use the fully managed runtime that abstracts away the container as well (and thus not spinning up a separate filesystem MCP), I refactored the state slightly to use native state instead of saving everything to disk - but logic stayed more or less the same. No fiddling with CDK, VPCs, and load balancers in this case, just nice and easy deployment.

A last tip (one that I haven't tried myself but am very keen to): there is an [AWS Bedrock AgentCore MCP Server
](https://github.com/awslabs/mcp/tree/main/src/amazon-bedrock-agentcore-mcp-server) - plug this into your vibe coding set-up and your agent will potentially build itself! Jokes aside - it will help you with documentation and best practices in your building journey :)

### Observability and evaluation 📊

The Strands Agents documentation has a whole section on observability and evaluation which is great. 

It outlines the classic software engineering observability with traces, metrics, and logs and applies them to AI workflows with suggestions to analyse edge cases and collecting traces to do evaluation, benchmarking, and fine-tuning. An agent comes out-of-the-box with [metrics](https://strandsagents.com/latest/documentation/docs/user-guide/observability-evaluation/metrics/#eventloopmetrics) about token usage, cycle duration, and some tool metrics that give you insight into failure rates of the tool. [Just like ADK](https://matthiasbaetens.com/posts/2025-07-20-adk/#:~:text=integration%20with%20what%20is%20still%20one%20of%20my%20favourite%20Google%20Cloud%20products%3A%20their%20observability%20platform%2C%20fully%20compatible%20with%20OpenTelemetry.), Strands comes with native integration with the industry standard [OpenTelemetry](https://strandsagents.com/latest/documentation/docs/user-guide/observability-evaluation/traces/#opentelemetry-integration), giving you the flexibility to route that data to AWS X-Ray, but also to alternatives like [Jaeger](https://www.jaegertracing.io/) or [Langfuse](https://langfuse.com/). 

Lastly, it includes a discussion about why investing in telemetry makes sense: of course, to know about when your agent breaks, but also to keep track of costs & usage trends, as well as customer satisfaction. The latter goes into agent [evaluation](https://strandsagents.com/latest/documentation/docs/user-guide/observability-evaluation/observability/#end-to-end-observability-framework:~:text=Research%20and%20Applied,model%20fine%2Dtuning), analysing failures, building ground truths, and using data to finetune. It has sections on [test case categories](https://strandsagents.com/latest/documentation/docs/user-guide/observability-evaluation/evaluation/#test-case-categories), [metrics to consider](https://strandsagents.com/latest/documentation/docs/user-guide/observability-evaluation/evaluation/#metrics-to-consider), and [evaluation approaches](https://strandsagents.com/latest/documentation/docs/user-guide/observability-evaluation/evaluation/#evaluation-approaches).

In the first iteration, I integrated my agent with the observability platform offered by [Langfuse](https://langfuse.com/). The set-up is _super_ easy: just create an account and plug-in a few environment variables and you will start seeing traces appear in the platform. What you get is _super_ helpful:

<div style="text-align: center;">
  <img src="/images/2025-08-14-aws-bedrock-browser-agents/langfuse.png" 
       alt="Langfuse observability platform" 
       style="max-width: 100%; height: auto;">
</div>

1. All the loops your agent does while trying to reach it's goal
2. LLM calls (with input and output) that are part of that loop (great to inform iterations on your system prompt and potentially tool descriptions). Notice also the total input and output tokens
3. Tool calls (with input and output)
4. Extra information for each of the components on the left that are selectable, in this case the goal I gave the agent and the output it generated (report with the vulnerabilities it has found)

It also includes latencies for each of the steps in case you want to optimise certain parts of your run.

One thing I was missing is the full prompt (as we discussed above, not only user input gets passed to the LLM, but also the system prompt and tool descriptions). For that, I can recommend turning on [Bedrock Model Invocation logging](https://docs.aws.amazon.com/bedrock/latest/userguide/model-invocation-logging.html) which showed me the whole context, including `messages`, `system`, `toolConfig` with different `toolSpec`s: 

<div style="text-align: center;">
  <img src="/images/2025-08-14-aws-bedrock-browser-agents/model-invocation-logging.png" 
       alt="Bedrock Model Invocation logging" 
       style="max-width: 100%; height: auto;">
</div>

That being said, with the launch of AgentCore, we got another set of options, baked straight into AWS through AgentCore Observability. The [AgentCore docs](
https://aws.github.io/bedrock-agentcore-starter-toolkit/user-guide/observability/quickstart.html) have a great quickstart guide and the steps are quite trivial, so if you prefer to consolidate everything into AWS and avoid external integrations, this is definitely the way to go! It looks something like this:

<div style="text-align: center;">
  <img src="/images/2025-08-14-aws-bedrock-browser-agents/aws-cloudwatch.jpg" 
       alt="AWS CloudWatch observability" 
       style="max-width: 100%; height: auto;">
</div>

This way, everything (logs, metrics, and traces) are neatly stored in CloudWatch and you just need to keep an eye out on the [Generative AI observability](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/GenAI-observability.html) page!

# Conclusion and future work 🎬

## Conclusion

We've come a long way from those staggering internet statistics to building our own intelligent agent that can navigate and analyze the web for security vulnerabilities. In this post, we built a production-ready Attack Surface Management agent using AWS Bedrock and Strands Agents, taking it from concept to a cloud-native deployment.

We walked through the complete architecture: from choosing an agent framework and understanding the latest in reasoning models, to implementing browser automation and grounding our agent with a knowledge base of CVEs. We then took it all the way to production with AWS Fargate and AgentCore, complete with proper observability through Langfuse and CloudWatch and sprinkled with some comparisons to ADK along the way.

When we unleashed our agent on `testphp.vulnweb.com`, a website designed to be vulnerable, it autonomously discovered and exploited several critical security flaws. Amongst others, it successfully performed a **SQL injection** to bypass the login, found and demonstrated both **reflected and stored Cross-Site Scripting (XSS)** vulnerabilities, and even identified that the site had been compromised and was redirecting to a defacement page. This test run proved that the agent can not only discover potential attack vectors but also validate them, providing concrete evidence of real-world risks.

## Future work

While the agent works, there's still plenty of room for improvement that I would like to work on next:
- Proper **context window management**: right now we're relying on Strands' built-in `SlidingWindowConversationManager`, but for our use-case we don't want to rely on the context window to keep track of what has been done, what needs to be done, and the intermediate findings. Instead... 
- We should design a **better state management** system: using the filesystem MCP (and later internal agent state) served as a quick prototype, but a production system demands better. A dedicated state management solution would enable more reliable tracking and comprehensive documentation of security findings.
- **Proper evaluation**: Right now, we're flying somewhat blind without a systematic evaluation framework. Building a test suite with known vulnerabilities, establishing baseline metrics, and implementing the evaluation approaches discussed in the Strands documentation would give us confidence that each iteration actually improves the agent's capabilities. Since this is a very domain-heavy exercise, I'll probably need to find some strong collaborators for that :)

The code for everything we discussed is available on [GitHub](https://github.com/matthiasa4/aws-bedrock-browser-use) and in the meantime, Amazon Bedrock [AgentCore went GA](https://aws.amazon.com/blogs/machine-learning/amazon-bedrock-agentcore-is-now-generally-available/) as well, making it ready for your production use cases! Feel free to experiment, improve, and share what you build!