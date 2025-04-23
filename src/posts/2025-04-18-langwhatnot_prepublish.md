---
layout: layouts/post.njk
title: Captions, coral, and code or how I taught an AI to caption my underwater adventures
date: 2025-04-19
featuredImage: matthiasbaetens.com/images/2024-08-25-marine-conservation-in-okinawa/seedling-planting/seedling-sea.jpg
tags: 
  - posts
description: 236 days or almost 8 months. I guess I kept my "More coming (probably not so) soon" promise.  
---

236 days or almost 8 months. I guess I kept my "More coming (probably not so) soon" promise.

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/intro/coming_soon.png">
      <div class="caption">Only 7 months of distraction and procrastination.</div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

But here we are again. I've utilised the past 7 months to hone my distraction skills and perfect procrastination. I'm using an odd weekend at home in Singapore to write-up something I've shared with the biggest audience I've had the pleasure to speak for at DevFest 2024 Shanghai and a great bunch of Open Source people at FOSSAsia 2025 in Thailand.

If your last 7 months were a bit more productive and you did me the honour to read (part) of the [previous post](https://matthiasbaetens.com/posts/2024-08-25-marine-conservation-in-okinawa/), you might remember some impressions from Okinawa and the marine conservation activities I did there - paired with some pictures I took along the journey. That last part is exactly what this next post is about...

The attentive reader might've noticed I started with writing verbose captions for every picture, even with some attempts at trying to be funny. 

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/intro/captions_start.png">
      <div class="caption">Ambitious (caption) start.</div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

Not too much later, towards the end of the blogpost, things started turning to the rather... "lazy"? side.

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/intro/captions_end.png">
      <div class="caption">Turning to laziness not too much after...</div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

Since I was in the middle of trying to understand the Gen AI hype, I decided to kick the tyres and build something that could help automate my laziness away... 

# The inspiration 

There were a few things that inspired me to go build something that would solve an "acute" problem, apart from all the noise in general about how good (or bad) LangChain and AI tooling was.

One was a blogpost by BAIR (Berkeley Artificial Intelligence Research) that talked about ["The Shift from Models to Compound AI Systems"](https://bair.berkeley.edu/blog/2024/02/18/compound-ai-systems). Up until that point, the LLM world felt like very much "researcher only" terrain to me, so I was happy to see how I could make my way "inside" the field from an engineering point-of-view. It discussed moving beyond large language models to integrating multiple specialised components — such as language models, retrieval systems, and external tools — into compound AI systems to offer enhanced performance, adaptability, and control.

<div class="swiper-container">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-inspiration/bair-blog.png">
      <div class="caption">"The Shift from Models to Compound AI Systems"</div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

Another inspiration (hey Andrew Ng is back!) came from the founder of Google Brain discussing the trend of AI Agents and their potential impact, covering topics like reflection, tool-use, planning, and multi-agent collaboration (maybe he knew about the [A2A protocol](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) coming up?!) on [YouTube](https://www.youtube.com/watch?v=sal78ACtGTc):

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-inspiration/ng-agents.png">
      <div class="caption">"What's next for AI agentic workflows"</div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

# The demo

What better way to help to understand the reader what I built than showing some caption generation in action? Initially I was planning to do a live demo for my talk in Shanghai, but last minute logistical challenges (you won't believe it involved PowerPoint) prompted me to make a recording instead.

So below, a quick demo of the system I built to generate captions for my previous blogpost's pictures:

<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin-bottom: 20px;">
  <video controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    <source src="/images/2025-04-19-langwhatnot/demo/langwhatnot.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

The demo shows the image captioning agent and how it combines **LangChain** for prompt and model orchestration, **LangGraph** for structuring the workflow as a stateful graph, and **LangSmith** for tracing and evaluation - covering my original intent of finding out a bit more about the LangChain ecosystem. 

Furthermore, it is powered by Google's multimodal model [**Gemini 1.5 Pro**](https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024) alongside [**Gemma 2**](https://blog.google/technology/developers/google-gemma-2/) (Google's open-source LLM announced in summer 2024) to generate captions. 

Let's dig a bit deeper on all of this.

# The tech

So what exactly did we see in the demo? Let's look at the different steps:
1. **Summarise blog**: The script begins by summarising the blog content to extract key points with the help of _Gemini 1.5 Pro_. This summary provides context for generating captions.
2. **Describe image**: We use _Gemini 1.5 Pro_ to get a rich description of the photo.
3. **Generate captions**: Given the blog as context and the description of the image, we ask _Gemma 2 9B_ to come up with a few caption proposals.
4. **Human input**: We pause the agent for human input, ensuring captions are not only contextually relevant but also user-approved.
5. Depending on the input given by the human we:
   1. **Refine captions**: Ask _Gemma_ to come up with new captions that adhere to the user's instructions.
   2. **Save captions**: We approve and save the caption.

### LangGraph

This seems like the perfect time to introduce [LangGraph](https://www.langchain.com/langgraph). Some of you might have spotted it while watching the demo, but these steps perfectly fit a _directed graph_:
<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-tech/langgraph-graph.png">
      <div class="caption">Visual representation of my LangGraph graph</div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

Without going too deep into graph theory, a graph consists of _nodes_ and _edges_:
- The _nodes_ control _what_ happens and are basically tasks or functions 
- The _edges_ control the _flow of possible next steps_. 
 
While LangChain was mostly supporting DAGs (Directed Acyclic Graphs), [LangGraph introduces cycles and conditional branches](https://blog.langchain.dev/langgraph/#:~:text=These%20are%20where%20a%20function,to%20pass%20in%20three%20things), paramount to agentic behaviour (or, in our case, putting a [human-in-the-loop](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/)).

Running through these different nodes, as you will see in the code, the _state_ gets updated (the `StateGraph` I used to construct the workflow is essentially a state machine). If this reminds you (even the `|` syntax) of another project dear to my heart, [Apache Beam](https://beam.apache.org), I have good news: you're right; but the `PTransforms` got switched for LLM-operations. LangGraph was apparently [inspired](https://langchain-ai.github.io/langgraph/#acknowledgements:~:text=LangGraph%20is%20inspired%20by%20Pregel%20and%20Apache%20Beam.) by Apache Beam and Pregel.

Want to dive deeper in the concepts? Head to the [LangGraph docs](https://langchain-ai.github.io/langgraph/concepts/low_level/).

### LangChain

Going one level deeper, into the nodes of my LangGraph graph, we meet its older brother, [LangChain](https://www.langchain.com). 

While it's more capable than that, in the demo LangChain gets used to _format prompts_, _abstract LLM calls_, and _parse outputs_ in a chain. 

For *prompt formatting*, I define a PromptTemplate which I feed into model calls after supplying some input parameters before feeding it to an output parser using the [LangChain Expression Language (LCEL)](https://python.langchain.com/docs/concepts/lcel) pipeline syntax. 

LCEL allows you to construct *chains*: “piping” components together in a declarative way – for example, `prompt | model | parser` creates a sequence where the prompt’s output feeds into the model, and the model’s output feeds into a parser​. Under the hood, LangChain treats each piece (prompt, LLM, parser) as a Runnable and the `|` operator composes them.

*LLM abstraction* It allows you to quickly experiment with different models; e.g. I was using Gemini through [Vertex AI on Google Cloud](https://cloud.google.com/vertex-ai), but LangChain has many [more integrations](https://python.langchain.com/docs/integrations/chat/#featured-providers).

Another nifty feature in the LangChain box of magic are [*output parsers*](https://python.langchain.com/docs/concepts/output_parsers/). These are useful, since:
1. Not all models have this capability built-in (for example, [Gemini 1.5 Pro](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/1-5-pro#:~:text=Controlled%20generation) does (it's called "Controlled Generation"), but Gemma does not).
2. Your computer doesn't speak natural language, but might know how to deal with a JSON.

This is a powerful way to enforce structured output – the LLM is asked to produce an output conforming to the [Pydantic schema](https://docs.pydantic.dev/latest/), and the parser will validate/parse the LLM’s text into a Python object​.

### Gemini and Gemma

Let’s talk about the dynamic duo - at this point I have mentioned *Gemini* and *Gemma* a few times. While it feels a bit weird to write about Gemini 1.5 Pro and Gemma 2 while several Gemini 2.5 models have been released and [Gemma 3](https://blog.google/technology/developers/gemma-3) is out, these were the models I built the demo with a few months back.

At the time of launch, [Gemini 1.5 Pro](https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024) stood out for its native multimodal design and its 1 million token context window (which was tested in research up to 10 million tokens). Back then (feels like ages ago), it was [topping the leaderboards](https://x.com/tuvllms/status/1819051689372184995) as well.

In one case, I had an image of me underwater holding a coral seedling – Gemini described everything from the colour of the water to the fact I was scuba diving and carrying coral fragments, noting the sense of scientific activity. Pretty cool, because it “knew” from the blog context that this was a marine conservation activity, so it focused on that rather than, say, describing my hairstyle or my friend in the background. Context matters!

I have a CAPS LOCK todo item on my list to try out [Gemini 2.5 Pro](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025) which is topping the [LMArena leaderboard](https://lmarena.ai/?leaderboard) today and is promising to release a 2 million context window soon (I will need to write a lot more blogposts for that). As I might not need this much smarts for my use-case, [Gemini 2.5 Flash](https://developers.googleblog.com/en/start-building-with-gemini-25-flash) would be good to try as well as it has a "thinking budget", which gives you control over the amount of tokens used during the reasoning phase. This means you can balance between speed and depth of thought - using more tokens when you need careful analysis and fewer when you need quick responses, all while keeping costs predictable.

<div class="swiper-container">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-tech/gemini25.png">
    </div>
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-tech/gemini25flash.png">
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

Taking a closer look at the smaller, open-source brother, [Gemma 2](https://ai.google.dev/gemma/docs/core/model_card_2), which was released in the summer of 2024; it comes in 2B, 9B and 27B sizes, which is perfect if you want to test things locally with e.g. [`ollama`](https://ollama.com). 
That was my initial plan: keep everything local for quick iterations (which is why I love small, open-source models!) and keep some extra $£€ in my pocket - but the length of my blogpost prohibited this. 

The first time it ran for an image, it gave me a range rather serious captions (“A tiny coral, a big impact: learning about reef restoration and contributing to Okinawa's underwater world”). Obviously, I wanted something shorter and funnier, so that's what I asked for in the human-in-the-loop step; generating "Planting coral seedlings is serious business, but I’m pretty sure Matthias is judging my dance moves underwater. 🐠😂". Guess another todo list item is to fine-tune Gemma to my jokes?...

Last month, Google also released [Gemma 3](https://blog.google/technology/developers/gemma-3/), coming in 1B, 4B, 12B, and 27B parameter versions, making it fit for different hardware set-ups. It comes with multimodal capabilities, support for over 140 languages and a 128k-token window, probably making my usage of multiple models in my demo redundant.

If you want to dig deeper, I recommend checking out the technical reports linked below.

<div class="swiper-container">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-tech/gemma2.png">
      <div class="caption"><a href="https://arxiv.org/abs/2408.00118" target="_blank">Gemma 2 technical report</a></div>
    </div>
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-tech/gemma3-launch.png">
      <div class="caption"><a href="https://blog.google/technology/developers/gemma-3" target="_blank">Gemma 3 launch</a></div>
    </div>
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-tech/gemma3.png">
      <div class="caption"><a href="https://arxiv.org/abs/2503.19786" target="_blank">Gemma 3 technical report</a></div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

# The future (mine and... yours?)

Looks like we're off to a fun start: I learned a few things while building something that makes my life a bit easier - but while writing this blogpost my todo list only got longer. Here's what I'm excited to explore next:

### Model Improvements

- I already mentioned testing out the new Gemini 2.5 models for their improved capabilities
- I've been itching to get my hands dirty with fine-tuning one of the open source models (looking at you, Gemma 3 👀) to better match my style out of the box.

### User Interfaces & Experience

- I'd like to give my Agent a proper face rather than just CLI interaction - some experimentation with [Gradio](https://www.gradio.app/) or [Streamlit](https://streamlit.io/) would make it more accessible (maybe I can even let you interact with it!)

### Emerging Standards & Protocols

- [Model Context Protocol (MPC)](https://www.anthropic.com/news/model-context-protocol) got a lot of attention lately and with [Google](https://techcrunch.com/2025/04/09/google-says-itll-embrace-anthropics-standard-for-connecting-ai-models-to-data/), [OpenAI](https://techcrunch.com/2025/03/26/openai-adopts-rival-anthropics-standard-for-connecting-ai-models-to-data/), and [Amazon](https://aws.amazon.com/blogs/machine-learning/harness-the-power-of-mcp-servers-with-amazon-bedrock-agents/) showing support, it's poised to become the industry standard. I am curious to explore what it can do next.
- At Google Cloud Next 2025, Google released the [Agent2Agent Protocol (A2A)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) and [Agent Development Kit](https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/) - I will need to fit them into my mental model of the broader ecosystem.