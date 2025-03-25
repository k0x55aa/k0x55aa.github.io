import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  const logo = baseDir + "/images/logo.png"
  
  return (
    <h2 class={classNames(displayClass, "page-title")}>
      k0x55aa
    </h2>
  )
}

PageTitle.css = `
.page-title {
  font-size: 1.75rem;
  margin: 0;
}
`

PageTitle.afterDOMLoaded = `
  function changeTheme(theme) {
    var logo = "/images/logo.png"
    if (theme === "dark") {
      logo = "/images/dark-logo.png"
    }
    
    const element = document.getElementById("logo");
    if (element !== undefined) {
      element.src = logo; 
    }
    console.log("Theme changed to " + e.detail.theme) // either "light" or "dark"
  }

  document.addEventListener("themechange", (e) => {
    const theme = e.detail.theme
    changeTheme(theme);
  });

  window.addEventListener("load", (e) => {
    changeTheme(localStorage.getItem("theme"));
  });
  
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
