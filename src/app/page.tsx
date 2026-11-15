import Divider from "./components/divider"
import AboutMe from "./components/home/about-me"
import Experience from "./components/home/experience"
import HeroSection from "./components/home/hero-section"
import ProjectOverview from "./components/home/project-overview"
import Footer from "./components/layout/footer"
import { getPortfolioContent } from "@/lib/portfolio-content-server"

export const dynamic = "force-dynamic"

const Page = async () => {
  const content = await getPortfolioContent()

  return (
    <>
      <main>
        <HeroSection profile={content.profile}/>
        <Divider/>
        <AboutMe about={content.about}/>
        <Divider/>
        <Experience experienceData={content.experienceData}/>
        <Divider/>
        <ProjectOverview
          projectOverview={content.projectOverview}
          featuredWork={content.featuredWork}
        />
        <Divider/>
      </main>
      <Footer footerText={content.footerText}/>
    </>
  )
}

export default Page