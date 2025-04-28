import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`} style="text-align: center">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css" />
        
        {/* <p>
          {i18n(cfg.locale).components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz v{version}</a> © {year}
        </p>
         */}
         <p>
          <a href="https://github.com/k0x55aa" target="_blank" class="text-white" style={"margin-right: 1.0rem!important"}><i class="fa-brands fa-github"></i></a>
          <a href="https://twitter.com/k0x55aa" target="_blank" class="text-white" style={"margin-right: 1.0rem!important"}><i class="fa-brands fa-x-twitter"></i></a>
          <a href="https://www.linkedin.com/in/krishnamohansonowal" target="_blank" class="text-white" style={"margin-right: 1.0rem!important"}><i class="fa-brands fa-linkedin"></i></a>
        </p>
        © {year} ProjectAsuras
        {/* <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul> */}
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
