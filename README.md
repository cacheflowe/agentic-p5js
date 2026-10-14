# Agentic p5.js

You already know some p5.js. This project shows how to bring that knowledge
into a local coding environment, understand the tools around your sketch, and
use AI assistance without giving up creative control.

Our main walkthrough uses **Visual Studio Code + GitHub Copilot**. You can run
the sketch without any AI tools, and other editors and assistants can work with
the same project.

You do not need prior web development experience. Start by running the sketch,
then explore the tools and workflows at your own pace.

## Contents

- [Agentic p5.js](#agentic-p5js)
  - [Contents](#contents)
  - [Set up and run the project](#set-up-and-run-the-project)
    - [1. Install the basics](#1-install-the-basics)
    - [2. Get the project and open the folder](#2-get-the-project-and-open-the-folder)
    - [3. Set up highlighting and formatting](#3-set-up-highlighting-and-formatting)
    - [4. Install the dependencies](#4-install-the-dependencies)
    - [5. Start the development server](#5-start-the-development-server)
  - [Find your way around the project](#find-your-way-around-the-project)
    - [Instance Mode vs Global Mode](#instance-mode-vs-global-mode)
  - [Make your first change](#make-your-first-change)
  - [Add AI coding help](#add-ai-coding-help)
    - [Set up GitHub Copilot in VS Code](#set-up-github-copilot-in-vs-code)
    - [Choose your assistant](#choose-your-assistant)
    - [Choose the right amount of help](#choose-the-right-amount-of-help)
    - [Pick a model for the task](#pick-a-model-for-the-task)
  - [Give your assistant useful context](#give-your-assistant-useful-context)
  - [Build professional habits](#build-professional-habits)
    - [Keep the feedback loop short](#keep-the-feedback-loop-short)
    - [Keep control of the assistant](#keep-control-of-the-assistant)
    - [Use Git for checkpoints](#use-git-for-checkpoints)
  - [Project instructions and p5.js references](#project-instructions-and-p5js-references)
    - [Durable project guidance](#durable-project-guidance)
    - [Included references and skills](#included-references-and-skills)
    - [Try a guided-context experiment](#try-a-guided-context-experiment)
  - [Optional tools and concepts](#optional-tools-and-concepts)
  - [Troubleshooting](#troubleshooting)

## Set up and run the project

### 1. Install the basics

- [Visual Studio Code](https://code.visualstudio.com/): the editor where you
  browse files, write code, and talk to your coding assistant.
- [Node.js](https://nodejs.org/): install a currently supported **LTS**
  (Long-Term Support) release. It includes **npm**, which installs project
  dependencies and runs project commands. This project's Vite version requires
  Node.js 20.19+ in the 20.x line, or 22.12+.

Restart VS Code after installing Node.js so its terminal can find the new tools.

### 2. Get the project and open the folder

On this repository's GitHub page, choose **Code > Download ZIP**, extract the ZIP,
and open the extracted folder with **File > Open Folder** in VS Code.

If you already use Git, you can **clone** the repository instead: cloning
downloads the files along with their version history. In
[GitHub Desktop](https://desktop.github.com/), choose **File > Clone Repository**
and paste this repository's URL.

Open the folder in VS Code. This gives both VS Code and your assistant access
to the entire project's structure.

### 3. Set up highlighting and formatting

VS Code includes syntax highlighting for JavaScript, HTML, and CSS. For automatic formatting, open VS Code's **Extensions** view and install
[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
(`esbenp.prettier-vscode`). It keeps indentation, spacing, and line wrapping
consistent in JavaScript, HTML, CSS, and other files. Prettier is the equivalent of **Tidy Code** in the p5.js Web Editor:
it automatically formats your code and makes it "pretty". In VS Code you can have it run automatically whenever you save.

This repository includes [.vscode/settings.json](./.vscode/settings.json) to
select Prettier and enable **format on save**, plus an
[extension recommendation](./.vscode/extensions.json). Install the extension,
open the project folder, and save a source file to try it.

[.prettierrc.json](./.prettierrc.json) is a configuration file for Prettier. It sets a generous **160-character target
width** and preserves existing Markdown prose wrapping. The width is a formatting
hint, not a strict limit or an option to disable all wrapping.

If formatting does not run, open the **Command Palette** with **Cmd+Shift+P**
on macOS or **Ctrl+Shift+P** on Windows/Linux, choose **Format Document With...**,
and select Prettier. Check for language-specific settings overriding the project's
formatter or format-on-save setting.

### 4. Install the dependencies

In VS Code, choose **Terminal > New Terminal**. The terminal is a text interface
where you type commands and read their output. Make sure it is in this project's
folder, then run:

```sh
npm install
```

This downloads the libraries listed in [package.json](./package.json) into a
local `node_modules` folder. Wait for the command to finish before continuing.
You normally do this once after downloading the project, and again when its
dependencies change.

### 5. Start the development server

```sh
npm run dev
```

Open the **Local** URL printed in the terminal. It is usually
`http://localhost:5173/`, but it might use another port, such as `5174`, if that
port is already occupied.

The terminal also prints a **Network** URL. Other devices on the same network,
such as your phone, can open the sketch at that address. If they cannot connect,
check that your computer's firewall allows Node.js on private networks.

`localhost` means your own computer. This development server is not a published
website. Leave the terminal running while you work; save a file to see the
browser update. Press **Ctrl+C** in that terminal when you want to stop it.

## Find your way around the project

This project installs p5.js through npm and imports it with `import p5 from "p5"`, which is how modern JavaScript projects typically manage dependencies and import functionality from multiple JavaScript files, known as [modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import).
That is different from loading p5.js with a script link to a CDN, which is the default for the p5.js web editor.

### Instance Mode vs Global Mode

The default sketch assigns its lifecycle functions to `window`, the browser's
global object. This is called global mode, and is closest to how the p5.js web editor works.

In instance mode, functions and values belong to a particular
p5 instance: you write `s.createCanvas()` and `s.mouseX` rather than
`createCanvas()` and `mouseX`. To try the instance-mode sketch, switch the commented script lines in
[index.html](./index.html) so only `./src/sketch-instance-mode.js` is loaded.
Keep only one sketch entry script active at a time. Instance mode is particularly useful for running multiple sketches simultaneously, or running a p5.js sketch in a larger website.

## Make your first change

Open [src/sketch.js](./src/sketch.js). In `draw()`, change the `fill()` color or
the `ellipse()` size, save the file, and look at the result in your browser.
Try this without AI first: it confirms that your edit/save/preview loop works.

## Add AI coding help

### Set up GitHub Copilot in VS Code

1. Open VS Code's **Extensions** view.
2. Find and enable GitHub Copilot from the verified GitHub publisher, following
   VS Code's setup prompts.
3. Sign in with your GitHub account and complete any required access setup.
   Availability, limits, and pricing depend on your plan.
4. Open the **Chat** view.

See the [VS Code Copilot setup guide](https://code.visualstudio.com/docs/copilot/setup)
if your interface differs.

Start with an explanation-only request:

> Read the active sketch and explain setup() and draw() to someone who has used
> the p5.js Web Editor but is new to VS Code. Do not edit any files.

### Choose your assistant

Copilot is a great option if you already have a GitHub account, but professionals use all of the tools below, largely depending on which subscription they already have:

- [Claude Code](https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code) from Anthropic
- [Codex](https://marketplace.visualstudio.com/items?itemName=openai.chatgpt) from OpenAI
- [Google Antigravity](https://antigravity.google/product/antigravity-cli/) from Google

Each extension adds its own chat panel (and optional CLI mode) to VS Code. These tools
are all extremely similar: each can read your files, edit code, and run commands with your
permission. But each one does things slightly differently, including
**which context & configuration files it reads automatically**:

| Tool                 | Project instructions it reads | Project skill folders it checks                         |
| -------------------- | ----------------------------- | ------------------------------------------------------- |
| GitHub Copilot       | `AGENTS.md`                   | `.github/skills/`, `.agents/skills/`, `.claude/skills/` |
| Codex (OpenAI)       | `AGENTS.md`                   | `.agents/skills/`                                       |
| Claude Code (Claude) | `CLAUDE.md`                   | `.claude/skills/`                                       |

This project's guidance lives in [AGENTS.md](./AGENTS.md) and
[.agents/skills/](./.agents/skills/), so Copilot and Codex find it on their own.
Claude Code does not look in either place. With Claude Code, ask it directly to
read `AGENTS.md` and the skill, or see
[Project instructions and p5.js references](#project-instructions-and-p5js-references)
for how a project can support several tools at once.

These details change as the tools are updated. Check each tool's documentation,
and ask the assistant which instruction files and skills it loaded when you are
unsure.

**Customize your workspace for your tools.** Expect to adjust a project like this
one so it works well with the assistant you chose. Your assistant can help with
that too: it can read the existing setup and propose the files your tool needs.
For example:

> I'm using Claude Code. Read AGENTS.md and .agents/skills/p5js/SKILL.md, then
> suggest how to set up this workspace so you load the same instructions and
> skill automatically. Explain each file before you create it.

If you use several assistants, keeping a copy of the same guidance for each one
gets tedious and the copies drift apart. A **harness sync tool** keeps one
**source of truth** instead: you edit your instructions and skills in one place,
and the tool symlinks or reformats them into each harness's expected locations.
[agents-config-sync](https://github.com/Hovercraft-Studio/agents-config-sync)
is one example, covering several of the main harnesses.

### Choose the right amount of help

| Capability         | Useful for                                             | First exercise                                                       |
| ------------------ | ------------------------------------------------------ | -------------------------------------------------------------------- |
| Inline suggestions | Small completions while typing                         | Finish a familiar drawing statement; accept only what you understand |
| Ask/chat           | Explanations and debugging conversations               | Ask what an error means without requesting edits                     |
| Plan               | Working out an approach before changing code           | Ask for a short plan for adding a particle system                    |
| Agent              | Reading files, making edits, and using permitted tools | Request one small sketch change and ask it to check the result       |

Mode names and features vary by assistant and version. A chat panel and a
command-line interface (CLI) are different interfaces, not different levels of
autonomy: either can host an agent.

**Agentic coding** means the assistant can take steps toward a goal using tools,
such as reading files, editing code, and running checks. It is not a guarantee
that the result is correct. Start small and keep reviewing what it does.

### Pick a model for the task

Most chat panels have a **model picker** near the message box. Models from the
same company usually trade capability against speed and cost. For example,
Anthropic's **Claude Opus** is more capable than **Claude Sonnet**, but it is
slower and uses more of your plan's limits or credits.

Matching the model to the task is called **routing**:

- **Faster, cheaper model:** explaining a line of code, renaming a variable,
  tweaking colors, or small, well-defined edits.
- **More capable model:** planning a bigger feature, debugging something
  confusing, or a change that touches several files.

Start with the faster model, and switch up when the answers stop being good
enough. Some tools offer an **Auto** option that routes for you; how well that
works, and what each model costs, depends on your tool and plan. Model names
change often, so check what your picker offers rather than memorizing a list.

## Give your assistant useful context

**Context** is the information available to the assistant for a particular
request. Do not assume it has read every file, every open tab, or your terminal.

A useful request includes:

1. **Goal:** what you want to see or accomplish.
2. **Relevant files:** the sketch, references, or exact error.
3. **Constraints:** what must stay unchanged.
4. **Success check:** how you will know it worked.

An example prompt:

> Read the active sketch selected by index.html and the visual-effects reference
> in .agents/skills/p5js/references/visual-effects.md. Make the circle drift smoothly with
> Perlin noise. Keep the canvas size and existing dependencies unchanged.
> Explain your changes. Use my already-running server at localhost:5173, so
> do not start another server. Check that the circle stays inside the canvas.

In Copilot, use the chat's context/attachment controls to add files or selected
code. File mentions often use `#`; other tools may use `@` or `/` for auto-completion. Available shortcuts
for terminals, errors, folders, and web content vary, so use your tool's context
picker rather than assuming a tag works everywhere.

When debugging, include the **exact error text**, what you did before it appeared,
and what you expected. If an API is unfamiliar, ask the assistant to consult
the [p5.js reference](https://p5js.org/reference/) and check compatibility with
the installed version.

## Build professional habits

A professional workflow is less about collecting tools and more about making
changes that you can understand, verify, and recover.

### Keep the feedback loop short

1. Make one focused change.
2. Review the **diff**, a comparison showing added and removed lines.
3. Save and try the result in the browser.
4. Check the browser console and terminal for errors.
5. Save a checkpoint with Git before the next experiment.

### Keep control of the assistant

- Read edits before accepting them. Ask for explanations, smaller steps, or a
  different approach when needed.
- Review command permissions. An agent working locally is not necessarily
  sandboxed; it may be able to change files or access services.
- Keep secrets and private data out of prompts, attachments, and logs you share.
- Let the assistant use your existing server, not manage it for you.
- Ask what it actually checked. "It should work" is not evidence that it ran.

### Use Git for checkpoints

Git records local version history; GitHub hosts and shares repositories online.
Saving a file is not the same as making a Git **commit**: a commit records a
named checkpoint of selected changes.

We recommend [GitHub Desktop](https://desktop.github.com/), a free app that
gives you buttons and a visual diff instead of terminal commands. Many
professionals use it every day. It includes Git, so you do not need to install
Git separately to use it.

- **Downloaded a ZIP?** Choose **File > Add Local Repository**, select the project
  folder, and follow the prompt to create a repository when you are ready to
  track your own changes.
- **Cloned the repository?** It already has Git history. If you cloned it with
  GitHub Desktop, it is already listed; otherwise add it with
  **File > Add Local Repository**.

Before a larger experiment, review the changed files and their diffs, select only
the changes you intended, write a short descriptive summary, and **Commit**.
**Repository > Open in Visual Studio Code** takes you back to your editor.

VS Code's **Source Control** view and the
[Git command line](https://git-scm.com/) do the same job, so use whichever you
prefer. AI assistants usually run Git through the command line, which needs
[Git](https://git-scm.com/) itself installed. Install it if you want your
assistant to check what changed or make commits for you.

Keep source files and the lockfile in version control. Generated dependencies
and local files are excluded by [.gitignore](./.gitignore). Never commit passwords
or API keys; an ignore rule is not a substitute for checking what you stage.

## Project instructions and p5.js references

### Durable project guidance

[AGENTS.md](./AGENTS.md) records reusable project guidance: server ownership,
creative preferences, and which references to consult. This avoids repeating
every preference in every conversation.

Instruction discovery varies by tool. Codex and compatible agents use
`AGENTS.md`; Copilot also has its own instruction mechanisms, and Claude Code
uses `CLAUDE.md`. Do not assume one filename is automatically loaded everywhere.
If unsure, attach our guidance explicitly to a chat and ask the assistant to summarize
the rules before editing.

These are project instructions, not enforcement mechanisms. They guide agent behavior
but aren't always followed exactly.

### Included references and skills

This project includes one **agent skill**, [p5js](./.agents/skills/p5js/SKILL.md).
A skill is a folder with a `SKILL.md` entry file and, optionally, supporting
files such as references and scripts:

```text
.agents/skills/p5js/
├── SKILL.md           ← name and description metadata, plus which reference to read when
└── references/        ← nine detailed guides: core API, shapes, animation, color,
                         interaction, typography, visual effects, WebGL/3D, troubleshooting
```

The reference guides come from
[NousResearch's Hermes Agent p5.js skill](https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/p5js).
Credit goes to the upstream project and its contributors. See the
[Agent Skills standard](https://agentskills.io/) for the packaging format.

The skill loads in stages. At first the assistant sees only the skill's name and
description. When a request matches, it reads `SKILL.md`, and from there only
the reference files it needs. This keeps a large amount of guidance available
without filling the assistant's context with all of it.

Depending on your assistant's harness and configuration, skills can be
**invoked automatically** when their description matches your request, or
**invoked explicitly with a slash command** in the chat window, such as `/p5js`, when the harness
supports it. Different harnesses (like Copilot and Claude) also look for skills in different folders, so a skill is not
guaranteed to load, and the behavior may vary depending on the assistant's environment and configuration.

You can always ask the agent to **read a skill or reference file directly**,
provided it has access to that file. For example:

> Read .agents/skills/p5js/references/webgl-3d.md and use its relevant guidance
> for this sketch. Check the examples against our installed p5.js version.

### Try a guided-context experiment

Use separate chats and the same starting code for each run:

1. Ask: "Create a simple animated p5.js sketch." Review the choices it makes.
2. In a fresh chat, explicitly attach the project guidance and relevant
   reference. Repeat the request with constraints: dark canvas background,
   no new dependencies, preserve canvas size, and use the existing server.
3. Compare the results and diffs. Which choices improved? Which instructions
   were missed? What would you clarify next?

## Optional tools and concepts

You do not need these to complete the walkthrough.

- **Agent harness:** the software around the model that manages tools, context,
  permissions, and execution. Reliable checks give that system feedback; a test
  suite is not the harness itself.
- **MCP (Model Context Protocol):** a standard for connecting assistants to tools
  and data sources, such as a browser or issue tracker. An MCP connection does
  not automatically make access safe; review the server and its permissions.
  See [the MCP documentation](https://modelcontextprotocol.io/).

## Troubleshooting

| Problem                                     | What to check                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `npm` is not found                          | Install Node.js, then restart VS Code and its terminal                                   |
| npm cannot find `package.json`              | Open a terminal in the project folder containing [package.json](./package.json)          |
| Vite reports an unsupported Node.js version | Install a supported LTS version satisfying the requirement above                         |
| Dependencies are missing                    | Run `npm install` in the project folder and read any installation errors                 |
| The page does not open                      | Use the exact Local URL printed by your running server                                   |
| The port is different                       | Vite may choose the next available port; update your browser URL and tell your assistant |
| You opened the HTML file directly           | Use the development server URL, not a `file://` page                                     |
| The page is blank or the sketch errors      | Check the browser console, terminal, and active script in [index.html](./index.html)     |
| AI edits seem unrelated                     | Attach the correct files, state constraints, and request a smaller change                |

When you get stuck, ask the chat for help with the exact output and what you tried.
Learning how to investigate is part of the workflow, and this is something that AI-assisted development is really helpful for.
