workflow "Deploy master to gh-pages" {
  on = "push"
  resolves = ["Deploy to GitHub Pages"]
}

action "Setup dotnet and build blazor app" {
  uses = ".github/workflows/build-blazor-app.yml"
}

action "Deploy to GitHub Pages" {
  needs = ["Deploy to GitHub Pages"]
  uses = "maxheld83/ghpages@v0.2.1"
  env = {
    BUILD_DIR = "public/"
  }
  secrets = ["GH_PAT"]
}
