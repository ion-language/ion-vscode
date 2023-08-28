![](images/ion_icon.png)

# ion-vscode

VS Code extension for the Ion programming language, providing syntax highlighting and an automatic setup system for easy debugging with GDB within Visual Studio Code.

![](images/screenshot.png)

## Project structure

For optimal functioning of the extension and gdb debugging, your workspace should adhere to the following structure:

```
WorkspaceRoot/
│
└─main/
  └─main.ion
```

Make sure at the root of your workspace there's a folder named `main`, and within that folder, a file that contains the `main` function of your Ion program.
The `task.json` expects this structure.

## Features

1. **Syntax Highlighting**: Enhanced code visibility for `.ion` files to improve readability and productivity.
2. **Automatic Setup System**:
   - Detects when a `.ion` file is opened in a workspace that doesn't have the necessary debugging configurations.
   - Prompts the user to set up the current workspace for an Ion project.
   - Automatically creates a `.vscode` folder with `launch.json` and `tasks.json` configurations, streamlining the debugging setup process.
3. **Custom GDB Debugger Path**:
   - Configurable path to the GDB debugger to match your system setup.
   - Ensures that the path is set and valid before proceeding with other setups.

## How to Install

- Clone or download the repository.
- Open the extension's tab in VS Code (Ctrl + Shift + X).
- Click on the three dots in the top-right corner.
- Select `Install from VSIX...`
- Select the `ion-vscode-0.2.5.vsix` file in the `vsix` folder in the downloaded repo.

## Configuration

Before leveraging the full features of the extension, ensure you set up the path to your GDB debugger. To do this:

1. Go to the VS Code settings (File > Preferences > Settings or `Ctrl` + `,`).
2. In the search bar, type `IonGDB.Path` to find the extension's specific setting.
3. Set the path to where your `gdb.exe` is located.

## Release Notes

### 0.2.5

Initial release with syntax highlighting and automatic debugger setup.

**Enjoy!**

## Developer Notes

Publishing an extension to the Visual Studio Code marketplace involves several steps. Here's a general overview:

1. Prepare your Extension: Ensure that your extension is ready for publishing. This includes writing good documentation, adding relevant metadata in the package.json (like displayName, description, categories, icon, etc.), and testing the extension thoroughly.

2. Set up a Microsoft Account: If you don't have a Microsoft account, create one. You will use this account to log into the Visual Studio Code Marketplace and Azure DevOps.

3. Personal Access Token:

   - Log into the Azure DevOps.
   - Navigate to Security.
   - Click on "+ New Token".
   - Give your token a name and select a duration for it.
   - Under "Scopes", select Custom defined and then select "Marketplace (publish)".
   - Click "Create", and then make sure to copy the token now (you won’t get another chance).

4. Install the vsce Publishing Tool:
   vsce is a command line tool that helps package, publish, and manage VS Code extensions. Install it using npm:
   ```
   npm install -g vsce
   ```
5. Packaging your Extension: Navigate to your extension directory and run:

   ```
   vsce package
   ```

   This will generate a .vsix file which is a packaged version of your extension.

6. Publishing your Extension:

   - Log in to the publisher:

     ```
     vsce login [publisher name]
     ```

     (Use the Microsoft account from step 2 and the Personal Access Token from step 3.)

   - Once logged in, you can publish your extension with:
     ```
     vsce publish
     ```

7. Update Extension: In the future, when you update your extension, increment the version number in package.json, then run vsce package and vsce publish again.

8. Unpublishing (Optional): If for some reason you need to remove your extension from the marketplace, you can do so with:

   ```
   vsce unpublish [publisher name].[extension name]
   ```

More detailed instructions and guidelines can be found in the official [VS Code documentation](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
