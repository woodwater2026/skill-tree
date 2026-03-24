# How We Audit 500+ AI Agent Skills for Security

*By Lin Wan, Water Woods AI*

AI agent skills are becoming the new plugins.

They look small. They spread fast. And they often carry much more power than users assume.

A single skill can open a browser, call remote APIs, write files, run shell commands, delegate to another model, or trigger deployment workflows. That is why the ecosystem is exploding. It is also why the ecosystem now needs a real trust layer.

At Water Woods AI, we started building **Skill Tree** because we saw the same pattern everywhere:

> Skills were getting stars faster than they were getting reviewed.

That is a discovery success — and a security failure.

This is the core method we now use to audit skills before we recommend them.

---

## The problem: popularity is not a safety signal

Most skill directories already answer:
- what a skill does
- how many stars it has
- which ecosystem it belongs to

Very few answer:
- does it make network requests?
- does it write or delete files?
- does it execute shell commands?
- does it touch secrets or environment variables?
- does it delegate into another execution layer?
- should normal users install it by default?

That gap matters.

Because the most popular skills are often the most powerful — and powerful skills usually carry the largest blast radius.

---

## Our rule: measure outside-world impact

We do not audit skills with a naive safe/unsafe binary.

We start with one practical question:

> **If this skill runs by default, what can it do to the outside world?**

That gives us five audit dimensions.

### 1. Network behavior
We flag evidence of:
- HTTP requests
- scraping
- remote fetches
- API calls
- browser automation
- proxy usage

### 2. File-system behavior
We check for:
- file writes
- appends / overwrites
- delete / unlink behavior
- repo scaffolding

### 3. Execution and delegation behavior
We look for:
- shell execution
- subprocess calls
- CLI orchestration
- delegation to other models or tools

### 4. Secrets and environment access
We scan for:
- environment variables
- tokens and API keys
- auth flows
- secret-dependent setup

### 5. High-impact operations
We elevate scrutiny for skills involving:
- deployment
- reverse engineering
- remote infrastructure
- browser-driven workflows
- security research

---

## The review pipeline

We use a two-stage process.

### Stage 1: static triage
We scan repository structure and sampled files for:
- suspicious file paths
- execution hints
- network behavior
- file mutation signals
- secret handling clues

This lets us sort skills quickly into three buckets:
- **directly includable**
- **includable after remediation / warnings**
- **not recommended for default inclusion**

### Stage 2: deep human review
For the hottest or riskiest skills, we produce a written audit that includes:
- security grade
- main risks
- recommendation status
- minimum remediation conditions
- why the skill is still strategically valuable (if applicable)

That is where a directory becomes a trust product instead of just a link list.

---

## What we learned from our first 10 audits

The first result was blunt:

> **The most visible skills in the ecosystem skew much higher-risk than most users expect.**

Not because they are necessarily malicious.
But because the ecosystem currently rewards **capability density**, not **trust clarity**.

We repeatedly saw four patterns.

### Pattern 1: delegation without clear trust boundaries
Some skills pass work to another model, tool, or execution layer.

Useful? Yes.

Safe by default? Usually no.

When users think they are authorizing one skill, but are actually authorizing a chain of execution, the trust boundary is already unclear.

### Pattern 2: scraping and proxy-heavy workflows
Skills that fetch social data, use proxies, or perform external search/reporting are common and often valuable.

But they need explicit labeling around:
- outbound requests
- external dependencies
- compliance assumptions
- data exposure risk

### Pattern 3: one-command deployment promises
Deployment skills are attractive because they hide complexity.

That is also the problem.

They often abstract away:
- shell execution
- file mutations
- environment assumptions
- infrastructure side effects

That makes them advanced operational tools, not general-purpose defaults.

### Pattern 4: security research skills with broad execution latitude
Security-focused skills belong in the ecosystem.

But they should almost never be promoted without:
- audience labeling
- scope boundaries
- warning banners
- explicit permission assumptions

---

## How we turn audits into catalog decisions

We do not use a single include/exclude gate.

We use three buckets.

### 1. Directly includable
Low-risk or tightly scoped skills with clear utility and low external blast radius.

These are ideal for a first library because they improve user trust immediately.

### 2. Includable after remediation or warning labels
These skills are strategically important, but need stronger framing before inclusion.

Examples from our early review set included projects such as:
- `trailofbits/skills`
- `cisco-ai-defense/skill-scanner`
- `vercel-labs/skills`

These matter because they shape the ecosystem. But they should only appear with:
- risk labels
- permission summaries
- minimum remediation conditions
- “not safe by default” positioning

### 3. Not recommended for default inclusion
These are skills we may still preserve in a **risk sample library**, but not recommend into the first default index.

This often includes:
- delegation-heavy skills
- scraping / proxying tools
- one-command deployment tools
- reverse-engineering skills
- remote system manipulation workflows

---

## The big ecosystem insight

The most important lesson from the first audit wave was not that risky skills exist.

It was that the ecosystem’s visible surface is still optimized for **finding powerful tools**, not **helping users trust the right ones**.

That is why Skill Tree exists.

We want a catalog to answer two different questions:

1. **What exists?**
2. **What should be recommended, and under what conditions?**

Those are not the same question.

Today, most directories collapse them into one metric: stars.

We think the better rule is:

> **Stars decide what to review first. Security decides what to recommend.**

That principle now drives our entire curation model.

---

## What happens next

The next step for Skill Tree is straightforward:
- expand catalog coverage
- maintain a risk-sample library
- standardize machine-readable audit output
- show “why included,” “minimum remediation required,” and “recommended audience” beside every important entry

That is how a catalog becomes decision infrastructure.

Not just another awesome list.

---

## Final thought

The biggest security problem in agent-skill ecosystems is not hidden malware.

It is **misplaced intuition**.

People still assume a skill is lightweight because it looks lightweight.
But even a short skill can:
- call a network
- mutate a repo
- trigger a deployment
- leak context
- chain into another execution layer

Skills should be treated less like snippets and more like **dependencies with agency**.

The winners in this ecosystem will not be the teams that publish the most skills.
They will be the teams that make the right skills trustworthy.

That is the bet behind Skill Tree.
