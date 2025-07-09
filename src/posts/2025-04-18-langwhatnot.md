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

<div class="swiper-container">
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


But here we are again. I've utilised the past 7 months to hone my distraction skills and perfect procrastination. I am using the odd weekend home in Singapore to write up something I've shared with the biggest audience I've had the pleasure to speak for at DevFest 2024 Shanghai and a great bunch of Open Source enthusiasts at FOSSAsia 2025 in Thailand.

If your last 7 months were a bit more productive and you did me the honour to read (part) of the [previous post](https://matthiasbaetens.com/posts/2024-08-25-marine-conservation-in-okinawa/), you might remember some impressions from Okinawa and the marine conservation activities I did there - paired with some pictures I took along the journey. That last part is exactly what this next post is about...

The attentive reader might've noticed I wrote verbose captions for every picture, even with some attempts at trying to be funny. 

<div class="swiper-container">
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

<div class="swiper-container">
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

Since I was in the middle of trying to understand the Gen AI hype, I decided to kick the tyres and build something that could help automate my laziness away... But before we start prompting, a bit of background on my Gen AI journey.

(don't care about the story, just want to know about how you can help out? I GOT YOU COVERED: <a href="#the-demo">click here to skip to the next section</a>)

Full table of contents:
- [The background story](#the-background-story)
  - [The bad 😬](#the-bad)
  - [The good 🎉](#the-good-)
  - [The ugly 🤡](#the-ugly-)
- [The inspiration](#the-inspiration)
- [The demo](#the-demo)
- [The tech](#the-tech)
  - [LangGraph](#langgraph)
  - [LangChain](#langchain)
  - [Gemini and Gemma](#gemini-and-gemma)
  - [Groq](#groq)
  - [LangSmith](#langsmith)
- [The result](#the-result)
- [The future (mine and... yours?)](#the-future-mine-and-yours)
    - [Model Improvements](#model-improvements)
    - [User Interfaces \& Experience](#user-interfaces--experience)
    - [Emerging Standards \& Protocols](#emerging-standards--protocols)


# The background story

It’s September 2023, and I’ve just joined [DoiT](https://doit.com/). The generative AI space was in full hype mode since the launch of ChatGPT in November 2022. Not long after, [Google](https://blog.google/technology/ai/bard-google-ai-search-updates) launched Bard, and [Meta](https://ai.meta.com/blog/large-language-model-llama-meta-ai) released (and later <del>leaked</del> "open-sourced") — their powerful LLaMA models in February. Microsoft added [Copilot](https://blogs.microsoft.com/blog/2023/03/16/introducing-microsoft-365-copilot-your-copilot-for-work/?utm_source=chatgpt.com) to Microsoft 365, [Anthropic](https://www.anthropic.com/news/introducing-claude) introduced Claude in March, and [Amazon](https://www.aboutamazon.eu/news/aws/aws-announces-amazon-bedrock-and-multiple-generative-ai-services-and-capabilities) launched Bedrock as part of AWS. It was a busy time — and to be honest, I mostly kept my head in the sand, hoping the hype storm would blow over.

My exposure so far was mainly limited to one of my good (photography) friends who had taken this awesome picture:
<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/intro/fede_og.jpg">
      <div class="caption">Breakfast in Penang.</div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

but then decided to turn it into this:

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/intro/fede_genai_0.jpg">
      <div class="caption">Penang breakfast gone wrong...</div>
    </div>
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/intro/fede_genai_1.jpg">
      <div class="caption">Penang breakfast gone wronger...</div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

No wonder that, when I was trying to answer the question "where is (Gen) AI going?" for my first presentation on Gen AI, the "bad" of my "the good, the bad and the ugly" was the biggest portion.

It looked something like this:

## The bad 😬

<div style="display: flex; justify-content: center; margin: 20px 0;">
  <img src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHo1azlsMDduYm40OG9maDY1OTVhNGtrcGEyYndpMmc2N3Bia3FybSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/2S3Aj8OeKtf0c/giphy.gif" alt="They took our jobs" style="max-width: 100%; height: auto;">
</div>

- **Job loss**: According to a [report](https://www.goldmansachs.com/insights/articles/generative-ai-could-raise-global-gdp-by-7-percent#:~:text=Analyzing%20databases%20detailing%20the%20task%20content%20of%20over%20900%20occupations%2C%20our%20economists%20estimate%20that%20roughly%20two%2Dthirds%20of%20U.S.%20occupations%20are%20exposed%20to%20some%20degree%20of%20automation%20by%20AI.) by Goldman Sachs, 2 out of 3 jobs in the US would be exposed to some degree of automation by AI.

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-bad/gs-automation.png">
      <div class="caption">Goldman Sachs report showing 2/3 of US jobs at risk of AI automation. <a href="https://www.goldmansachs.com/insights/articles/generative-ai-could-raise-global-gdp-by-7-percent" target="_blank">Source: Goldman Sachs</a></div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

- **Uproar in the creative industries**: AI winning art competitions, intellectual property lawsuits left, right and centre, and strikes in Hollywood.

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-bad/nyt-ai-art.png">
      <div class="caption">AI artwork "Théâtre D'opéra Spatial" won first place at the Colorado State Fair, sparking controversy. <a href="https://www.nytimes.com/2022/09/02/technology/ai-artificial-intelligence-artists.html" target="_blank">Source: NY Times</a></div>
    </div>
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-bad/wsj-copyright.png">
      <div class="caption">Writers and actors on strike over concerns including AI replacing creative work. <a href="https://www.wsj.com/articles/ai-chatgpt-hollywood-intellectual-property-spongebob-81fd5d15" target="_blank">Source: WSJ</a></div>
    </div>
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-bad/hbr-ip.png">
      <div class="caption">Intellectual property lawsuits against AI companies creating a legal battleground. <a href="https://hbr.org/2023/04/generative-ai-has-an-intellectual-property-problem" target="_blank">Source: HBR</a></div>
    </div>
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-bad/bbc-ai-imitation.png">
      <div class="caption">Concerns over OpenAI using Scarlett Johansson's voice without her consent. <a href="https://www.bbc.com/news/articles/cm559l5g529o" target="_blank">Source: BBC</a></div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

- **Misinformation and disinformation**: With tailored content creation becoming available for pocket change, combined with hallucinating LLMs, false information (purposefully) became more widespread.

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-bad/mit-disinformation.png">
      <div class="caption">Report showing how generative AI is boosting disinformation and propaganda worldwide. <a href="https://www.technologyreview.com/2023/10/04/1080801/generative-ai-boosting-disinformation-and-propaganda-freedom-house/" target="_blank">Source: MIT Technology Review</a></div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

- **Existential threat**: A topic that has always been present in movies (thinking of The Matrix), some leading figures in the industry sounded the alarm bell... while others claim we won't run blindly into our own doom. Some counterweights have popped up as well such as Google DeepMind forming a new org specifically focusing on AI safety and Ilya Sutskever founding a new company focusing on "safe superintelligence".

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-bad/mit-hinton.png">
      <div class="caption">Geoffrey Hinton, "Godfather of AI," left Google to sound the alarm on AI risks. <a href="https://mitsloan.mit.edu/ideas-made-to-matter/why-neural-net-pioneer-geoffrey-hinton-sounding-alarm-ai" target="_blank">Source: MIT</a></div>
    </div>
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-bad/nyt-extinction.png">
      <div class="caption">Open letter warning of extinction risk from AI, signed by industry leaders. <a href="https://www.nytimes.com/2023/05/30/technology/ai-threat-warning.html" target="_blank">Source: NY Times</a></div>
    </div>
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-bad/wired-lecun.png">
      <div class="caption">Yann LeCun of Meta offers contrasting view on AI risk, arguing superintelligence fears are overblown. <a href="https://www.wired.com/story/artificial-intelligence-meta-yann-lecun-interview/" target="_blank">Source: Wired</a></div>
    </div>
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-bad/ft-sutskever.png">
      <div class="caption">Ilya Sutskever founding a start-up focusing on 'safe' AI. <a href="https://www.ft.com/content/2988c7a3-0e70-4c5d-a3f3-665c2d0c37d3" target="_blank">Source: Financial Times</a></div>
    </div>
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-bad/techcrunch-deepmind-ai-safety.png">
      <div class="caption">Google DeepMind forms new organization focused on AI safety research. <a href="https://techcrunch.com/2024/02/21/google-deepmind-forms-a-new-org-focused-on-ai-safety/" target="_blank">Source: TechCrunch</a></div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

If you made it this far without the sudden onset of a depression - good job! I'll try to brighten up from here.


## The good 🎉

Onwards from the doom and gloom section, there are also lots of things to be excited about:

- **Economic tailwinds**: According to leading banks and consulting firms, Generative AI could boost global GDP by up to 7%, or $7 trillion. This growth has the potential to raise incomes, improve standards of living, increase government spending on public services, and create new opportunities in financial markets.

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-good/gs-gdp.png">
      <div class="caption">Goldman Sachs report predicting Gen AI could boost global GDP by up to 7%. <a href="https://www.goldmansachs.com/insights/articles/generative-ai-could-raise-global-gdp-by-7-percent" target="_blank">Source: Goldman Sachs</a></div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

- **Higher productivity**: Somewhat related, McKinsey found that AI is bound to automate up to 60 or 70% of our work, allowing us to get more things done in the same amount of time and allocating that time to higher-level decision making and higher-value work.

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-good/mck-productivity.png">
      <div class="caption">McKinsey report showing how AI could automate substantial portions of work, boosting productivity. <a href="https://www.mckinsey.com/capabilities/mckinsey-digital/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier" target="_blank">Source: McKinsey</a></div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

- **Democratising knowledge**: Who hasn't used one of the friendly bots to learn about a new topic? Gen AI puts knowledge at our fingertips with a barrier even lower than before. The World Economic Forum has written a piece about how Gen AI could be society's new equalizer, providing more equal opportunity to everyone.

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-good/wef-equalizer.png">
      <div class="caption">World Economic Forum discussing how Gen AI could serve as society's equaliser. <a href="https://www.weforum.org/stories/2024/02/generative-ai-society-equalizer/#:~:text=Generative%20AI%20is%20also%20simple,most%20powerful%20AI%20tools%20available" target="_blank">Source: World Economic Forum</a></div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

- **Business opportunities**: Gen AI also lowers the barrier for existing or new companies to build products that are AI-enabled. For this, I can recommend the ["Opportunities in AI" talk by Andrew Ng](https://www.youtube.com/watch?app=desktop&v=5p248yoa3oE&ab_channel=StanfordOnline) in which he gives an overview of the landscape and discusses some of the drivers of these changes.

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-good/yt-ng-opportunities.png">
      <div class="caption">Andrew Ng's "Opportunities in AI" talk highlighting business potential in the AI revolution. <a href="https://www.youtube.com/watch?app=desktop&v=5p248yoa3oE&ab_channel=StanfordOnline" target="_blank">Source: Stanford Online on YouTube</a></div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

## The ugly 🤡

Onto my personal favourite section. The failures. To compensate for all the doom and gloom, I probably spent a disproportionate amount of time laughing at people's creations on the internet. From:

Will Smith eating spaghetti:
<blockquote class="reddit-embed-bq" style="height:500px" data-embed-height="740"><a href="https://www.reddit.com/r/StableDiffusion/comments/1244h2c/will_smith_eating_spaghetti/">Will Smith eating spaghetti</a><br> by<a href="https://www.reddit.com/user/chaindrop/">u/chaindrop</a> in<a href="https://www.reddit.com/r/StableDiffusion/">StableDiffusion</a></blockquote><script async="" src="https://embed.reddit.com/widgets.js" charset="UTF-8"></script>

to memes coming to life:
<div style="display: flex; justify-content: center; margin: 20px 0;">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Dream Machine by Luma AI is just 3 days old.<br><br>Now memes are becoming videos.<br><br>10 wild examples:<br><br>1. Distracted boyfriend<a href="https://t.co/QXNDQdkY4P">pic.twitter.com/QXNDQdkY4P</a></p>&mdash; Madni Aghadi (@hey_madni) <a href="https://twitter.com/hey_madni/status/1801900554488291414?ref_src=twsrc%5Etfw">June 15, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

to the pope (RIP) making headlines for wearing a puffer jacket:
<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-ugly/guardian-pope.png">
      <div class="caption">The pope in a puffer jacket. <a href="https://www.theguardian.com/commentisfree/2023/mar/27/pope-coat-ai-image-baby-boomers" target="_blank">Source: The Guardian</a></div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

to gluing cheese to pizza:
<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-ugly/bbc-google-pizza-glue.png">
      <div class="caption">Eat rocks and glue cheese to pizza! <a href="https://www.bbc.com/news/articles/cd11gzejgz4o" target="_blank">Source: BBC</a></div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

to one that struck close to home: a make it "MOAR BELGIAN 🇧🇪" series:
<blockquote class="reddit-embed-bq" style="height:500px" data-embed-height="740"><a href="https://www.reddit.com/r/belgium/comments/184gp22/i_asked_chatgpt_to_create_a_typical_belgian_and/">I asked ChatGPT to create a typical Belgian and make him increasingly Belgian with each photo</a><br> by<a href="https://www.reddit.com/user/Sergiow13/">u/Sergiow13</a> in<a href="https://www.reddit.com/r/belgium/">belgium</a></blockquote><script async="" src="https://embed.reddit.com/widgets.js" charset="UTF-8"></script>

in which the final form was definitely missing some fries and beer.

These might all be a bit outdated by now, and I need to desperately update my research (and probably mental model of the world), but if this feels a bit confusing to you - that's exactly how I felt back then... 

And by now, I know Sam Altman was right: "I don't know what happens next"... but at least I managed to generate some captions for my blogpost. Onto the techy stuff!

<div class="swiper-container">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-ugly/sa-next.png">
      <div class="caption">Who knows what's next?</div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>


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

What better way to help you, the reader understand what I built than showing some caption generation in action? Initially I was planning to do a live demo for my talk in Shanghai, but last-minute logistical challenges (you won't believe it involved PowerPoint) prompted me to make a recording instead.

So below, a quick demo of the system I built to generate captions for my previous blogpost's pictures:

<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin-bottom: 20px;">
  <video controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    <source src="/images/2025-04-19-langwhatnot/demo/langwhatnot.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

The demo shows the image captioning agent and how it combines **LangChain** for prompt and model orchestration, **LangGraph** for structuring the workflow as a stateful graph, and **LangSmith** for tracing and evaluation - covering my original intent after reading about compound AI systems. 

Furthermore, it is powered by Google's multimodal model [**Gemini 1.5 Pro**](https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024) alongside [**Gemma 2**](https://blog.google/technology/developers/google-gemma-2/) (Google's open-source LLM announced summer 2024) to generate captions. 

Let's dig a bit deeper on all of this.

# The tech

So what exactly did we see in the demo? Let's look at the different steps:
1. **Summarise blog**: The script begins by summarising the blog content to extract key points with the help of **Gemini 1.5 Pro**. This summary provides context for generating captions.
2. **Describe image**: We use **Gemini 1.5 Pro** to get a rich description of the photo.
3. **Generate captions**: Given the blog as context and the description of the image, we ask **Gemma 2 9B** to come up with a few caption proposals.
4. **Human input**: We pause the agent for human input, ensuring captions are not only contextually relevant but also user-approved.
5. Depending on the input given by the human we:
   1. **Refine captions**: Ask **Gemma** to come up with new captions that adhere to the user's instructions.
   2. **Save captions**: We approve and save the caption.

## LangGraph

This seems like the perfect time to introduce [LangGraph](https://www.langchain.com/langgraph). Some of you might have spotted it while watching the demo, but these steps perfectly fit a _directed graph_:
<div class="swiper-container">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/the-tech/langgraph-graph.png">
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

Without going too deep into graph theory, a graph consists of nodes and edges. The nodes control _what_ happens and are basically tasks or functions while the _edges_ control the flow of possible next steps. While LangChain was mostly supporting DAGs (Directed Acyclic Graphs), [LangGraph introduces cycles and conditional branches](https://blog.langchain.dev/langgraph/#:~:text=These%20are%20where%20a%20function,to%20pass%20in%20three%20things), paramount to agentic behaviour (or, in our case, putting a [human-in-the-loop](https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/)).

While going through these different nodes, as you will see in the code, I updated the state (the <code>StateGraph</code> I used to construct the workflow is essentially a state machine). If this reminds you (even the <code>|</code> syntax) of another project dear to my heart, [Apache Beam](https://beam.apache.org), I have good news: you're right; but I switched <code>PTransforms</code> for LLM-operations. LangGraph was apparently [inspired](https://langchain-ai.github.io/langgraph/#acknowledgements:~:text=LangGraph%20is%20inspired%20by%20Pregel%20and%20Apache%20Beam.) by Apache Beam and Pregel.

Want to dive deeper into the concepts? Head to the [LangGraph docs](https://langchain-ai.github.io/langgraph/concepts/low_level/).

## LangChain

Going one level deeper, into the nodes of my LangGraph graph, we meet its "older brother", [LangChain](https://www.langchain.com). 

While it does more than that, I use LangChain to format prompts, call LLMs, and parse outputs in a chain. I define a `PromptTemplate` which I feed into model calls after supplying some input parameters before feeding it to an output parser using the [LangChain Expression Language (LCEL)](https://python.langchain.com/docs/concepts/lcel) pipeline syntax. LCEL allows you to “pipe” components together in a declarative way – for example, `prompt | model | parser` creates a sequence where the prompt’s output feeds into the model, and the model’s output feeds into a parser​. Under the hood, LangChain treats each piece (prompt, LLM, parser) as a Runnable and the `|` operator composes them.

It allows you to quickly experiment with different models; e.g. I was using Gemini through [Vertex AI on Google Cloud](https://cloud.google.com/vertex-ai), but LangChain has many [more integrations](https://python.langchain.com/docs/integrations/chat/#featured-providers).

Another nifty feature in the LangChain box of magic are [output parsers](https://python.langchain.com/docs/concepts/output_parsers/). These are useful, since:
1. Not all models have this capability built-in (for example, [Gemini 1.5 Pro](https://cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/1-5-pro#:~:text=Controlled%20generation) does (it's called "Controlled Generation"), but Gemma does not).
2. Your computer doesn't speak natural language, but might know how to deal with a JSON.

This is a powerful way to enforce structured output – the LLM is asked to produce an output conforming to the [Pydantic schema](https://docs.pydantic.dev/latest/), and the parser will validate/parse the LLM’s text into a Python object​.

## Gemini and Gemma

Let’s talk about the dynamic duo - at this point I have mentioned Gemini and Gemma a few times. While it feels a bit weird to write about Gemini 1.5 Pro and Gemma 2 while several Gemini 2.5 models have been announced and [Gemma 3](https://blog.google/technology/developers/gemma-3) is out, these were the models I built the demo with a few months back.

At the time of launch, [Gemini 1.5 Pro](https://blog.google/technology/ai/google-gemini-next-generation-model-february-2024) stood out for the native multimodal design and its 1 million token context window (which was tested up to 10 million tokens). Back then (feels like ages ago), it was [topping the leaderboards](https://x.com/tuvllms/status/1819051689372184995) as well.

In one case, I had an image of me underwater holding a coral seedling – Gemini described everything from the colour of the water to the fact I was scuba diving and carrying coral fragments, noting the sense of scientific activity. Pretty cool, because it “knew” from the blog context that I passed it that this was a marine conservation activity, so it focused on that rather than, say, describing my hairstyle or my friend in the background. Context matters!

I have a CAPS LOCK todo item on my list to try out [Gemini 2.5 Pro](https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025) which is topping the [LMArena leaderboard](https://lmarena.ai/?leaderboard) today and is promising to release a 2 million context window soon (I will need to write a lot more blogposts for that). As I might not need this much smarts for my use-case, [Gemini 2.5 Flash](https://developers.googleblog.com/en/start-building-with-gemini-25-flash) would be good to try as well as it has a "thinking budget", which gives you control over the amount of tokens used during the reasoning phase.

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

Taking a closer look at the smaller, open-source brother, [Gemma 2](https://ai.google.dev/gemma/docs/core/model_card_2), which was released in the summer of 2024; it comes in 2B, 9B and 27B sizes, which is perfect if you want to test things locally with e.g. <code>ollama</code>.  

That was my initial plan: keep everything local for quick iterations (which is why I love small, open-source models!) and keep some extra $£€ in my pocket - but the length of my blogpost prohibited this. 

The first time I ran the code for an image, it gave me a range rather serious captions (“A tiny coral, a big impact: learning about reef restoration and contributing to Okinawa's underwater world”). Obviously, I wanted something shorter and funnier, so that's what I asked for in the human-in-the-loop step; generating "Planting coral seedlings is serious business, but I’m pretty sure Matthias is judging my dance moves underwater. 🐠😂". Guess another todo list item is to fine-tune Gemma to my jokes?...

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

## Groq

While Gemini handles the multimodal heavy lifting in my demo, [Groq](https://groq.com/) provides lightning-fast inference for open-source models, making it perfect for the iterative caption generation and refinement steps where speed matters more than cutting-edge multimodal capabilities.

The beauty of this architecture lies in its flexibility and highlights how different models (and hardware) might be the better choice under different circumstances. Need cutting-edge multimodal image description? Gemini is probably your best friend. Want to have interactive iteration in near real-time? Groq will shine for rapid text iteration during a human-in-the-loop refinement process. In practice, this meant I could get 5 caption proposals in seconds rather than waiting much longer for a premium model to process what is essentially a pure text generation task.

Moreover, LangChain's model abstraction made this mix-and-match approach seamless – the same prompt templates and parsing logic work regardless of whether I'm calling Gemini or Groq, I just needed to handle the structured output differences (Gemini's native structured output vs Groq with Pydantic output parsers).

How did Groq achieve this lightning-fast inference? They developed a proprietary processor called a Language Processing Unit (LPU), designed from the ground up for AI inference. Their approach is based on 4 key design principles, as outlined in their [whitepaper](https://cdn.sanity.io/files/chol0sk5/production/4e3e6966d98da9ef4bfd9834dbfc00921da58252.pdf):
- **Software-first**: LPUs employ a programmable assembly line architecture, which enables the AI inference technology to use a generic, model-independent compiler, while, to maximize hardware utilization on GPUs, every new AI model requires coding of model-specific kernels.
- **Programmable Assembly Line Architecture**: while GPUs operate in a multi-core “hub and spoke” model, which involves more overhead to shuttle data back and forth between the compute and memory units, the LPU features data "conveyor belts" which move instructions and data between the chip's SIMD function units, eliminating bottlenecks within and across chips.
- **Deterministic Compute & Networking**: Every execution step is completely predictable, required to make an assembly line run efficiently. Data flow is statically scheduled by the software during compilation, and executes the same way every time the program runs.
- **On-chip memory**: LPUs include both memory and compute on-chip, vastly improving the speed of storing and retrieving data while eliminating timing variation. Groq's on-chip SRAM has memory bandwidth upwards of 80 terabytes/second, while GPU off-chip HBM clocks in at about eight terabytes/second.

Groq supports inference for Gemma 2 9B and a bunch of other open source models at modest prices: [groq.com/pricing](https://groq.com/pricing)

## LangSmith

[LangSmith](https://www.langchain.com/langsmith) is LangChain's observability and evaluation platform. It's a very helpful tool to peek under the hood of your LLM application, visualising the flow of a request through the different steps, and giving you insight into the input and output of each node in the graph. 

The setup was surprisingly easy – just add some environment variables and it automatically started tracing every step of my workflow. Beyond just visualising the separate steps, it also showed the latency for each of them, helping me understand where Groq was shining compared to Gemini. 

On the evaluation side, LangSmith offers tooling to build datasets that can help evaluate your agents for correctness, relevance, and other quality metrics. This makes it a powerful toolkit for iteratively improving your prompts or deciding when to swap your small open-source model for a more powerful alternative. As a nice bonus, it's compatible with OpenTelemetry standards – an open-source observability project that's dear to my heart.

<div class="swiper-container captions-below">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <img src="/images/2025-04-19-langwhatnot/demo/langsmith.png">
      <div class="caption">LangSmith's observability dashboard showing the flow and performance of my caption generation workflow.</div>
    </div>
  </div>
  <!-- Add pagination -->
  <div class="swiper-pagination"></div>
  <!-- Add navigation arrows -->
  <div class="swiper-button-next"></div>
  <div class="swiper-button-prev"></div>
</div>

In a nutshell, LangSmith provides the necessary tooling to move beyond your weekend idea into a full-fledged production project.

<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin-bottom: 20px;">
  <video controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    <source src="/images/2025-04-19-langwhatnot/the-tech/langsmith-demo.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

# The result

So, how did I end up using what I learned and coded up? I used it to write and inspire some of the updated captions [here](https://github.com/matthiasa4/matthiasa4.github.io/commit/b111f3410cb0c86c7d3906255f4a3895fd4f078e)!

The full code I used can be found in the [LangWhatNot repo on my GitHub](https://github.com/matthiasa4/langwhatnot/tree/main) - go take a look and let me know what you think :)

Too lazy to check it out yourself? I did a run-through with an example I used:
<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin-bottom: 20px;">
  <video controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    <source src="/images/2025-04-19-langwhatnot/demo/langwhatnot.mov" type="video/quicktime">
    Your browser does not support the video tag.
  </video>
</div>

I also included a full log of the run [here](https://github.com/matthiasa4/langwhatnot/blob/main/code/output/logs.txt) and the final output [here](https://github.com/matthiasa4/langwhatnot/blob/main/code/output/600px_info-0_caption_20250706_202547.txt).

# The future (mine and... yours?)

Looks like we're off to a fun start: I learned a few things while building something that makes my life a bit easier - but while writing this blogpost my todo list only got longer. Here's what I'm excited to explore next:

### Model Improvements

- I already mentioned testing out the new Gemini 2.5 models for their improved capabilities
- I've been itching to get my hands dirty with fine-tuning one of the open source models (looking at you, Gemma 3 👀) to better match my style out of the box.

### User Interfaces & Experience

- I'd like to give my Agent a proper face rather than just CLI interaction - some experimentation with [Gradio](https://www.gradio.app/) or [Streamlit](https://streamlit.io/) would make it more accessible (maybe I can even let you interact with it!)

### Emerging Standards & Protocols

- [Model Context Protocol (MCP)](https://www.anthropic.com/news/model-context-protocol) got a lot of attention lately and with [Google](https://techcrunch.com/2025/04/09/google-says-itll-embrace-anthropics-standard-for-connecting-ai-models-to-data/), [OpenAI](https://techcrunch.com/2025/03/26/openai-adopts-rival-anthropics-standard-for-connecting-ai-models-to-data/), and [Amazon](https://aws.amazon.com/blogs/machine-learning/harness-the-power-of-mcp-servers-with-amazon-bedrock-agents/) showing support, it's poised to become the industry standard. I've written a small [blogpost](https://engineering.doit.com/doit-launches-its-own-mcp-server-for-doit-cloud-intelligence-ff42b313c632) about our own MCP server at DoiT and can't wait to try build with it myself.
- At Google Cloud Next 2025, Google released the [Agent2Agent Protocol (A2A)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) and [Agent Development Kit](https://developers.googleblog.com/en/agent-development-kit-easy-to-build-multi-agent-applications/) - I will need to fit them into my mental model of the broader ecosystem.

Looking back at this journey – from somewhat of a Gen AI skeptic to someone who built something somewhat useful using it – I am hopeful on how Gen AI as a tool can be useful when you focus on solving real problems rather than chasing the hype. It feels good to take the chance to explore the landscape of sprawling tooling out there while building something that's actually personally useful. And you get thrown in the dopamine hit for free :)

What's for sure is that, for better or worse, we're stuck with LLMs and GenAI for the foreseeable future, and we better get used to integrating them into our workflows and think of them as an extension of our existing toolchain. The key? Start small, solve your own problems first, and don't be afraid to get your hands dirty with the code. You might just surprise yourself with what you can build.