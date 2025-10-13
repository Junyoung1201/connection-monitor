/**
 * @type {import('electron-builder').Configuration}
 */
module.exports = {
    appId: "me.junyoung.connection.monitor.app",
    productName: "Connection Monitor",
    directories: {
        output: "../../build-output"
    },
    files: [
        "public/**/*",
        "package.json",
        {
            from: "../renderer/build",
            to: "renderer",
            filter: ["**/*"]
        },
        "!**/*.map",
        "!**/node_modules/.bin",
        "!node_modules/*/{CHANGELOG.md,README.md,README,readme.md,readme,LICENSE,LICENCE}"
    ],
    nsis: {
        oneClick: false,
        allowToChangeInstallationDirectory: true,
        installerIcon: "assets/icon.ico",
        uninstallerIcon: "assets/icon.ico",
        installerHeaderIcon: "assets/icon.ico",
        createDesktopShortcut: true,
        createStartMenuShortcut: true
    },
    win: {
        target: [
            {
                target: "nsis",
                arch: ["x64"]
            },
            {
                target: "portable",
                arch: ["x64"]
            }
        ],
        icon: "assets/icon.ico",
        requestedExecutionLevel: "asInvoker",
        verifyUpdateCodeSignature: false,
    },
    mac: {
        target: "dmg",
        icon: "assets/icon.icns",
        category: "public.app-category.utilities"
    },
    linux: {
        target: "AppImage",
        icon: "assets/icon.png",
        category: "Utility"
    },
    compression: "maximum",
    removePackageScripts: true
};