const vscode = require('vscode');
const gdb = require('./src/gdbsetup');

/**
 * The activate function of the extension.
 * @param {vscode.ExtensionContext} context The extension context.
 */
function activate(context) {
    // Check and show popup for already open '.ion' file
    if (vscode.window.activeTextEditor) {
        gdb.checkAndShowPopup(vscode.window.activeTextEditor.document);
    }

    // Listen for saved files
    let disposableOnSave = vscode.workspace.onDidSaveTextDocument(document => {
        gdb.checkAndShowPopup(document);
    });

    // Listen for opened files
    let disposableOnOpen = vscode.workspace.onDidOpenTextDocument(document => {
        gdb.checkAndShowPopup(document);
    });

    context.subscriptions.push(disposableOnOpen, disposableOnSave);
}

/**
 * The deactivate function of the extension.
 * @param {vscode.ExtensionContext} context The extension context.
 */
function deactivate(context) { }

exports.activate = activate;
exports.deactivate = deactivate;