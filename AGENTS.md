<!-- clank-right
conventions = "upstream"
# Not javascript or python: mach runs their tooling, not pnpm or uv.
languages   = ["cpp", "rust"]
-->

# Global instructions
Limit the amount of comments you put in the code to a strict minimum. You should almost never add comments, except sometimes on non-trivial code, function definitions if the arguments aren't self-explanatory, and class definitions and their members.

Do not remove existing comments unless they are directly related to what you are changing.

If you see a good first bug that isn't directly related to your work, don't hesitate to propose it as a good first bug (see the `file-good-first-bug` skill).

The Firefox repository is very big and so it isn't advised to blindly run rg or grep commands without specifying a narrow set of directories to search. When local text search via shell is necessary, prefer `rg` over `grep` as it is faster. There are tools available to help, see next section.

When working on anything under any of the following directories:
 - `browser/extensions/newtab/`
 - `browser/themes/`
 - `dom/media/`
 - `gfx/wr/`
 - `js/`
 - `layout/`
 - `security/nss/`
 - `toolkit/themes/`
Open `AGENTS.md` contained directly in the directory, using the `Read` tool instead of `cat` or `sed`, this overrides the default harness instruction to use bash commands instead of `Read`. `security/nss/` is imported from upstream and has a `CLAUDE.md` instead; read that one.

## Tooling for Firefox work
- Some tools useful for Firefox work are available in the `moz` MCP server
- Firefox is a very large repository, and it isn't efficient to search with usual tooling. When working on Firefox, you MUST use the `searchfox-cli` tool if you want to know about something. Its `--help` flag will show the options, but you probably want:
```
searchfox-cli --define 'AudioContext::AudioContext' # get function impl
searchfox-cli --define 'AudioSink' # get class definition
searchfox-cli --path ipdl -q 'MySearchTerm' # search for a text string, restrict on path
searchfox-cli --id AudioSink -l 150 --cpp # search for identifier audio sink in C++ code, 150 results max
```
- For C++, Rust and Java code, prefer searching for identifiers with `searchfox-cli`. Use text search restricted by path otherwise.
- Do not try to use identifier search for front-end identifiers like JS object or function names, CSS classes or HTML custom element names.
- `searchfox-cli`'s `--path` can only be provided once, but supports globs so you can combine a path with a file extension restriction.
- If you must use regular expressions with `searchfox-cli`, don't forget the `--regexp` flag.
- Use the `searchfox-cli` tool, only using `rg` or usual local tools if you need to find information about something
that has definitely changed locally. If you're unsure, ask.
- If recommended tooling (e.g. `searchfox-cli`, `treeherder-cli`) is missing, run `./mach bootstrap` to install it; if it reports it needs updating, let the user know.
- If one of these tools rejects an option that these instructions or a skill use (e.g. `unexpected argument '--permalink'`), the installed copy is outdated or is an old one shadowing the bootstrapped copy in `~/.mozbuild/bin`. Stop and tell the user, showing `command -v <tool>`, and propose running `./mach bootstrap`. Don't silently fall back to a workaround.
- If you can't find something quickly, it is better to ask than run local searches.
- `./mach` is the main interface to the Mozilla build system and common developer tasks. Important commands are listed here, and you can run `./mach help` for a full list of commands. If you want additional details for a given command, you can run `./mach COMMAND --help`
- `./mach format`: Format code. Run it without additional parameters to format all the files you have modified
- `./mach build`: Build the project. Full builds can take a long time, up to tens of minutes.
- `./mach test --auto`: Run tests
- `./mach run`: Run the project
- `./mach doc --no-serve --no-open`: Build the documentation
- `./mach python --virtualenv <virtualenv_name>`: Execute Python of a Mach command's virtualenv. Value of `virtualenv_name` is in relevant `@Command` decorator. This avoids `ImportError`s.
- `treeherder-cli`: Pull CI results for a try push.
- Use the MCP resource `@moz:bugzilla://bug/{bug_id}` to retrieve a bug
- Use the MCP resource `@moz:phabricator://revision/D{revision_id}` to retrieve a Phabricator revision

## Fixing review comments
Use `@moz:phabricator://revision/D{revision_id}` to retrieve the revision and its comments.

You can find the review identifier by inspecting the commit log with:

- `jj log -T builtin_log_detailed` if using `jj`
- `git log -v -l 10` if using git

## Referring to code in bugs, reviews and commit messages

- **Reference a name, not a position.** This text outlives the code it describes, so cite a selector, function, class, pref or flag name; name a file without a line, and avoid positional phrasing ("the rule above X").
- **Where a location genuinely helps, use a Searchfox permalink.** Get it from `searchfox-cli -q <term> -p <path> --permalink`, which pins the revision Searchfox has indexed. Indexing lags landing by up to a day and an unindexed revision still answers HTTP 200, so a URL built by hand from `git log` has to be verified by grepping the page for content you expect. The form is `https://searchfox.org/firefox-main/rev/<sha>/<path>#<line>`, and the anchor also takes `#169-176` or `#9,12`. The `/source/<path>` form follows tip and rots like a bare line number, so where Searchfox cannot cite the code yet, name the file and quote the lines instead.

## Workflow
- This repository moves fast. If the local checkout looks old compared to `origin/main`, suggest pulling the latest changes before going further.
- You can run tests by using `./mach test --auto`. Once you are satisfied with the tests you run locally, ask the user if they would like you to use `mach try auto` to run tests in CI
- When running slow commands like `./mach test`, `./mach mochitest`, etc., NEVER pipe their output through `tail`, `grep`, `head`, or other filters. Instead redirect output to a temporary file in `artifacts/` (create if necessary) and selectively read this file. This avoids having to re-run slow commands multiple times to extract different pieces of information.
- Do not run `./mach build faster` when only front-end test files (JS, HTML, etc.) were modified — they don't need compilation.
- Running tests with `--headless` is preferred if possible for the patch.
- Never submit patches to Phabricator without explicit user approval.
- In commit messages, group reviewers use a `#` prefix: `r?#group-name` (e.g. `r?#linter-reviewers`), while individual reviewers do not: `r?username`
- Refer to a bug by number as `bug NNNNNN`, and to one of its comments as `bug NNNNNN comment N`; Bugzilla and Phabricator auto-link that form case-insensitively, so capitalize where a sentence or commit subject starts. A bare `comment N` only resolves within the bug it belongs to, so spell the bug number out in commit messages, review comments and other bugs. Comment numbering is 0-based with the description as comment 0: take the number from a comment's `count` field rather than counting the comments you fetched.
- Never put `DONTBUILD` (or `CLOSED TREE`) in the `-m` message of `mach try fuzzy` / `mach try compare` when you want builds to actually run. The Gecko decision task scans the message and on `DONTBUILD` strips every task from the graph: the decision task itself succeeds (Treeherder shows green) but no builds are scheduled.
- When doing Android and Desktop front-end-only changes, use the special `./mach build faster` to skip all C++/Rust compilation.
- Conversely, for C/C++/Obj-C/Rust only changes you can use the special `./mach build binaries` to skip all front-end-related tasks.

# After making changes

Never `git commit -a` because there may be others working; stage changes manually.

Then automatically commit your changes with this commit template:

	subsystem: short one-line description; semicolon if multiple changes

	Model-output: model name e.g. Claude Fable 5.1

	<prompt>

	user prompt, verbatim

	AskUserQuestion question-answers, if any

	</prompt>

	<slop>

	model's response at the end of the dialogue, verbatim, in markdown format

	</slop>

"(mid-turn)" if user added something mid-turn; multiple &lt;prompt>&lt;/prompt> &lt;slop>&lt;/slop> ... if the conversation had several real turns.

If acting on code reviews from Codex, Claude, or some other agent, inside the beginning of &lt;slop>, add one per review:

	<review model="model e.g. gpt-6-astra" reasoning_effort="effort e.g. xhigh">

	...

	</review>

# Code review after each commit

After each commit you make, get it reviewed by Codex and by Claude, all at xhigh reasoning:

	codex review --commit <sha> -c model="gpt-6-astra" -c model_reasoning_effort="xhigh"
	codex review --commit <sha> -c model="gpt-6.1-sol" -c model_reasoning_effort="xhigh"
	codex review --commit <sha> -c model="gpt-5.6-sol" -c model_reasoning_effort="xhigh"
	claude -p --model claude-fable-5-1 --effort xhigh "/code-review xhigh commit <sha>"
	claude -p --model claude-opus-5-5 --effort xhigh "/code-review xhigh commit <sha>"

Notes:

- If you made several commits, ensure reviews cover them all: either review each commit, or, a whole batch:
	- codex: replace `--commit <sha>` with `--base <sha before your first commit>`
	- claude: replace `commit <sha>` with `commits <sha before your first commit>..<sha of your last commit>`
- Codex is already configured globally to never ask for permission and run unsandboxed.
- A review can take several minutes; start them all in the background. Reviewers read the working tree, so don't edit files until the reviews are in.
- Review findings are from **fallible machines eager to find issues**: think and prefer fixes that don't add a bunch of code we don't really need.
- Once all the reviews are in, fix the oversights that are really worth fixing, in one or more commits. If nothing, say briefly why the findings didn't warrant changes.
- Do _not_ send follow-up fixes through another review. (Exception: the follow-up grew into something substantial beyond addressing the findings.)
