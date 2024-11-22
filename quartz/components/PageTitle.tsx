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
      <a href="/"><img src={logo} alt="Project Asuras" id="logo"/></a>
      {/* <a href={baseDir}>{title}</a> */}
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
  document.addEventListener("themechange", (e) => {
  const theme = e.detail.theme
  var logo = "/images/logo.png"
  if (theme === "dark") {
    logo = "/images/dark-logo.png"
  }
  
  const element = document.getElementById("logo");
  if (element !== undefined) {
    element.src = logo; 
  }
  console.log("Theme changed to " + e.detail.theme) // either "light" or "dark"
  // your logic here
})
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
