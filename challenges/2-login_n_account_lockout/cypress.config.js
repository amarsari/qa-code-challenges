const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        baseUrl: "http://localhost:8080",
        viewportWidth: 1280,
        viewportHeight: 720,
        video: false,
        setupNodeEvents(on, config) {
            //Implement node event listeners here
        }
    }
})