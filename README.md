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
  - [Understand your coding environment](#understand-your-coding-environment)
  - [Find your way around the project](#find-your-way-around-the-project)
  - [Make your first change](#make-your-first-change)
    - [Canvas size](#canvas-size)
  - [Add AI coding help](#add-ai-coding-help)
    - [Set up GitHub Copilot in VS Code](#set-up-github-copilot-in-vs-code)
    - [Choose the right amount of help](#choose-the-right-amount-of-help)
  - [Give your assistant useful context](#give-your-assistant-useful-context)
  - [Build professional habits](#build-professional-habits)
    - [Keep the feedback loop short](#keep-the-feedback-loop-short)
    - [Use Git for checkpoints](#use-git-for-checkpoints)
    - [Keep control of the assistant](#keep-control-of-the-assistant)
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
- A modern web browser: this is where your p5.js sketch runs.

Restart VS Code after installing Node.js so its terminal can find the new tools.

### 2. Get the project and open the folder

On this repository's GitHub page, choose **Code > Download ZIP**, extract the ZIP,
and open the extracted folder with **File > Open Folder** in VS Code.

If you already use Git, you can **clone** the repository instead: cloning
downloads the files along with their version history.

Open the folder in VS Code. This gives both VS Code and your assistant access
to the entire project's structure.

### 3. Set up highlighting and formatting

VS Code includes syntax highlighting for JavaScript, HTML, and CSS. p5.js
sketches are JavaScript, so **no p5-specific extension is needed for syntax
highlighting**. If a sketch opens as plain text, use the language selector in
the bottom-right status bar to select **JavaScript**.

Highlighting colors the code to make it easier to read. p5-specific autocomplete
and API documentation are separate features; we can explore those later.

For automatic formatting, open VS Code's **Extensions** view and install
[Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
(`esbenp.prettier-vscode`). It keeps indentation, spacing, and line wrapping
consistent in JavaScript, HTML, CSS, and other files.

Think of Prettier as the equivalent of **Tidy Code** in the p5.js Web Editor:
it tidies up the code's layout for you. Its exact formatting rules may differ,
and in VS Code you can have it run automatically whenever you save.

This project already provides p5.js and a Vite development server. You do not
need a p5 project generator or a Live Server extension: install dependencies
with npm and run the page with `npm run dev`.

This repository includes [.vscode/settings.json](./.vscode/settings.json) to
select Prettier and enable **format on save**, plus an
[extension recommendation](./.vscode/extensions.json). Install the extension,
open the project folder, and save a source file to try it.

[.prettierrc.json](./.prettierrc.json) sets a generous **160-character target
width** and preserves existing Markdown prose wrapping. The width is a formatting
hint, not a strict limit or an option to disable all wrapping.

If formatting does not run, open the **Command Palette** with **Cmd+Shift+P**
on macOS or **Ctrl+Shift+P** on Windows/Linux, choose **Format Document With...**,
and select Prettier. Check for language-specific settings overriding the project's
formatter or format-on-save setting.

Formatting changes how code is laid out, not what the sketch is intended to do.
It is not a bug checker or a substitute for trying the sketch. The extension
includes Prettier, so no extra npm package is needed for this initial setup.
We can explore more editor tooling later.

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

`localhost` means your own computer. This development server is not a published
website. Leave the terminal running while you work; save a file to see the
browser update. Press **Ctrl+C** in that terminal when you want to stop it.

**You manage the server.** Give your AI assistant its current URL and tell it
to use that server, not start, stop, or restart one. The same rule is recorded
in [AGENTS.md](./AGENTS.md).

## Understand your coding environment

If you have used the p5.js Web Editor, you have already used an editor, a preview,
and a place to see errors. Here, those responsibilities are split across tools:

| Tool                          | What it does                                                                |
| ----------------------------- | --------------------------------------------------------------------------- |
| VS Code                       | Edits files and provides navigation, error hints, terminals, and extensions |
| Browser                       | Runs the HTML, CSS, JavaScript, and p5.js sketch                            |
| Browser developer tools       | Show browser errors and let you inspect the running page                    |
| Terminal                      | Runs commands and displays their output                                     |
| Node.js and npm               | Support the local development tools and install dependencies                |
| Vite                          | Serves the project locally and updates the page when you save               |
| Git, when you add it          | Records checkpoints and shows what changed                                  |
| AI assistant, when you add it | Helps explain, plan, edit, and check code                                   |

**Your sketch runs in the browser, not inside VS Code or Node.js.** Node.js runs
the development tooling; Vite prepares the project for the browser.

An **IDE** is an integrated development environment: a workspace that brings
editing and development tools together. You do not need to configure everything
at once to start using one.

## Find your way around the project

| File or folder                                           | Purpose                                                            |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| [index.html](./index.html)                               | The page's structure and the script that selects the active sketch |
| [src/main.js](./src/main.js)                             | The default global-mode sketch, with `setup()` and `draw()`        |
| [src/main-instance-mode.js](./src/main-instance-mode.js) | An alternative sketch using p5.js instance mode                    |
| [src/style.css](./src/style.css)                         | Centers the canvas and follows your system's light/dark theme      |
| [public/](./public/)                                     | Static files that Vite serves directly                             |
| [package.json](./package.json)                           | Lists dependencies and available npm scripts                       |
| [package-lock.json](./package-lock.json)                 | Records resolved dependency versions for repeatable installs       |
| [.gitignore](./.gitignore)                               | Tells Git which generated and local files not to track             |
| [AGENTS.md](./AGENTS.md)                                 | Project guidance for compatible AI agents                          |
| [.agents/skills/](./.agents/skills/)                     | Local p5.js reference documents                                    |

The three web building blocks are **HTML** for page structure, **CSS** for page
appearance, and **JavaScript** for behavior. p5.js is a JavaScript library for
creative coding.

This project installs p5.js through npm and imports it with `import p5 from "p5"`.
That is different from loading p5.js with a script link to a CDN, a service that
hosts library files online. Vite handles the imported library for the browser.
Do not edit installed library files in `node_modules`.

The default sketch assigns its lifecycle functions to `window`, the browser's
global object. In instance mode, functions and values belong to a particular
p5 instance: you write `s.createCanvas()` and `s.mouseX` rather than
`createCanvas()` and `mouseX`.

To try the instance-mode sketch, switch the commented script lines in
[index.html](./index.html) so only `./src/main-instance-mode.js` is loaded.
Keep only one sketch entry script active at a time.

## Make your first change

Open [src/main.js](./src/main.js). In `draw()`, change the `fill()` color or
the `ellipse()` size, save the file, and look at the result in your browser.
Try this without AI first: it confirms that your edit/save/preview loop works.

### Canvas size

Choose the canvas size in p5.js with `createCanvas()`. The CSS centers canvases
that fit the browser window without stretching or shrinking them. Larger
canvases stay full-size and the page scrolls.

- `displayWidth` and `displayHeight` describe the screen.
- `windowWidth` and `windowHeight` describe the browser viewport.

For example, `createCanvas(windowWidth, windowHeight)` fits the viewport at
creation time. Following later window resizing also requires a
`windowResized()` handler and `resizeCanvas()`. In instance mode, use the
corresponding `s.` functions and values.

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

## Give your assistant useful context

**Context** is the information available to the assistant for a particular
request. Do not assume it has read every file, every open tab, or your terminal.

A useful request includes:

1. **Goal:** what you want to see or accomplish.
2. **Relevant files:** the sketch, references, or exact error.
3. **Constraints:** what must stay unchanged.
4. **Success check:** how you will know it worked.

For example:

> Read the active sketch selected by index.html and the visual-effects reference
> in .agents/skills/p5js-visual-effects.md. Make the circle drift smoothly with
> Perlin noise. Keep the canvas size and existing dependencies unchanged.
> Explain your changes. Use my already-running server at [paste your Local URL];
> do not start another server. Check that the circle stays inside the canvas.

In Copilot, use the chat's context/attachment controls to add files or selected
code. File mentions often use `#`; other tools may use `@`. Available shortcuts
for terminals, errors, folders, and web content vary, so use your tool's context
picker rather than assuming a tag works everywhere.

When debugging, include the **exact error text**, what you did before it appeared,
and what you expected. If an API is unfamiliar, ask the assistant to consult
the [p5.js reference](https://p5js.org/reference/) and check compatibility with
the installed version.

Better context helps, but incorrect output is not always your fault: models
can misunderstand requests, reason incorrectly, or suggest outdated APIs.

## Build professional habits

A professional workflow is less about collecting tools and more about making
changes that you can understand, verify, and recover.

### Keep the feedback loop short

1. Make one focused change.
2. Review the **diff**, a comparison showing added and removed lines.
3. Save and try the result in the browser.
4. Check the browser console and terminal for errors.
5. Save a checkpoint before the next experiment.

Open browser developer tools from your browser's menu and select **Console**.
Browser JavaScript errors appear there; tooling errors may appear in the
terminal or VS Code's Problems view.

This repository currently defines only `npm run dev`, not test, lint, or build
scripts. Do not assume commands such as `npm test` are configured. Browser checks
are our starting point; automated checks can be added as the project grows.

### Use Git for checkpoints

[Git](https://git-scm.com/) records local version history; GitHub hosts and shares
repositories online. Saving a file is not the same as making a Git **commit**:
a commit records a named checkpoint of selected changes.

If you downloaded a ZIP, install Git and use VS Code's **Source Control >
Initialize Repository** when you are ready to track your own changes. A cloned
repository already has Git history. Review changes, stage the intended files,
and commit with a descriptive message before a larger experiment.

Keep source files and the lockfile in version control. Generated dependencies
and local files are excluded by [.gitignore](./.gitignore). Never commit passwords
or API keys; an ignore rule is not a substitute for checking what you stage.

### Keep control of the assistant

- Read edits before accepting them. Ask for explanations, smaller steps, or a
  different approach when needed.
- Review command permissions. An agent working locally is not necessarily
  sandboxed; it may be able to change files or access services.
- Keep secrets and private data out of prompts, attachments, and logs you share.
- Let the assistant use your existing server, not manage it for you.
- Ask what it actually checked. "It should work" is not evidence that it ran.

## Project instructions and p5.js references

### Durable project guidance

[AGENTS.md](./AGENTS.md) records reusable project guidance: server ownership,
creative preferences, and which references to consult. This avoids repeating
every preference in every conversation.

Instruction discovery varies by tool. Codex and compatible agents use
`AGENTS.md`; Copilot also has its own instruction mechanisms, and Claude Code
uses `CLAUDE.md`. Do not assume one filename is automatically loaded everywhere.
If unsure, attach our guidance explicitly and ask the assistant to summarize
the rules before editing.

These are project instructions, not enforcement mechanisms. They guide behavior
but do not replace permissions, code review, or verification. They can also
become outdated: check them against the actual code and installed dependencies.

### Included references and skills

We grabbed the guides in [.agents/skills/](./.agents/skills/) from
[NousResearch's Hermes Agent p5.js references](https://github.com/NousResearch/hermes-agent/tree/main/skills/creative/p5js/references).
Credit goes to the upstream project and its contributors.

| Topic              | Reference                                                       |
| ------------------ | --------------------------------------------------------------- |
| Lifecycle and API  | [Core API](./.agents/skills/p5js-core-api.md)                   |
| Drawing            | [Shapes and geometry](./.agents/skills/p5js-shapes-geometry.md) |
| Motion             | [Animation](./.agents/skills/p5js-animation.md)                 |
| Palettes and color | [Color systems](./.agents/skills/p5js-color-systems.md)         |
| Input              | [Interaction](./.agents/skills/p5js-interaction.md)             |
| Text               | [Typography](./.agents/skills/p5js-typography.md)               |
| Noise and effects  | [Visual effects](./.agents/skills/p5js-visual-effects.md)       |
| 3D and shaders     | [WebGL/3D](./.agents/skills/p5js-webgl-3d.md)                   |
| Debugging          | [Troubleshooting](./.agents/skills/p5js-troubleshooting.md)     |

These are reference documents, not code that runs in the sketch. Mention or
attach the relevant file when asking for help.

A packaged **agent skill** has a discoverable entry file, usually
`<skill-name>/SKILL.md` with name and description metadata, plus optional
references and scripts. Our current standalone Markdown files are supporting
references, **not automatically registered skills**, despite their folder name.
See the [Agent Skills standard](https://agentskills.io/) for the packaging format.

Depending on your assistant's harness and configuration, registered skills can
be **invoked automatically** when their description matches your request, or
**invoked explicitly with a slash command**, such as `/skill-name`, when the
tool supports it. Discovery, command syntax, and automatic invocation vary by
tool; a relevant skill is not guaranteed to load for every request.

You can also ask the agent to **read a specific skill or reference file directly**,
provided it has access to that file. For example:

> Read .agents/skills/p5js-webgl-3d.md and use its relevant guidance for this
> sketch. Check the examples against our installed p5.js version.

This direct-file approach works with our current references without registering
them as skills. It loads reference material into the conversation rather than
invoking a registered skill through the harness.

### Try a guided-context experiment

Use separate chats and the same starting code for each run:

1. Ask: "Create a simple animated p5.js sketch." Review the choices it makes.
2. In a fresh chat, explicitly attach the project guidance and relevant
   reference. Repeat the request with constraints: dark canvas background,
   no new dependencies, preserve canvas size, and use the existing server.
3. Compare the results and diffs. Which choices improved? Which instructions
   were missed? What would you clarify next?

Do not remove project files just to run this exercise. Existing instructions
may already influence both chats, and model output varies, so this is an
exploration of context, not a controlled benchmark or a promise of compliance.

## Optional tools and concepts

You do not need these to complete the walkthrough.

- **Other environments:** [Cursor](https://cursor.com/) and
  [Windsurf](https://windsurf.com/) integrate AI assistance into their editors.
  [Replit](https://replit.com/) offers a browser-based environment.
- **Terminal assistants:** tools such as
  [Claude Code](https://code.claude.com/docs/en/overview),
  [Codex](https://developers.openai.com/codex/), and
  [Gemini CLI](https://geminicli.com/) let you work with an assistant from a
  terminal. Check each tool's setup, permissions, and billing.
- **Agent harness:** the software around the model that manages tools, context,
  permissions, and execution. Reliable checks give that system feedback; a test
  suite is not the harness itself.
- **MCP (Model Context Protocol):** a standard for connecting assistants to tools
  and data sources, such as a browser or issue tracker. An MCP connection does
  not automatically make access safe; review the server and its permissions.
  See [the MCP documentation](https://modelcontextprotocol.io/).
- **Model selection and routing:** assistants may offer different models or
  automatic selection. Faster models can suit small tasks; more capable models
  may help with difficult reasoning. Check quality, usage limits, and cost.
  Automatic routing is tool-dependent, not universal.

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

When you get stuck, ask for help with the exact output and what you tried.
Learning how to investigate is part of the workflow, not a prerequisite for it.
