"use client"
  import { BoxReveal } from "@/components/magicui/box-reveal";
  import { Meteors } from "@/components/magicui/meteors";
  import { Typewriter } from "../components/ui/typewriter"
  import { useRouter } from 'next/navigation';
  import { mainTitle, mainTitleBlueDecoration, subTitle, subTitleBlueDecoration, TypewriterTexts} from '@/setting/HomeSetting'

export default function Home() {
  const router = useRouter();
  return (
    <div className="bg-background text-foreground">
      {/* 欢迎部分 */}
      <section className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen flex items-center justify-center">
      <Meteors />
       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center mb-40 lg:mb-20">

          <BoxReveal boxColor={"#5046e6"} duration={0.5}>
            <p className="text-5xl sm:text-6xl lg:text-[5.5rem] font-semibold leading-tight">
            {mainTitle}<span className="text-[#5046e6] dark:text-[#7c6ef7]">{mainTitleBlueDecoration}</span>
            </p>
          </BoxReveal>
 
          <BoxReveal boxColor={"#5046e6"} duration={0.5}>
            <h2 className="mt-1 sm:mt-[.5rem] text-xl sm:text-2xl lg:text-[2rem]">
              {subTitle}
            <span className="text-[#5046e6] dark:text-[#7c6ef7]">{subTitleBlueDecoration}</span>
            </h2>
         </BoxReveal>

         <div className="mt-1 sm:mt-2 text-lg sm:text-xl lg:text-[1.3rem]">
            <Typewriter texts={TypewriterTexts} delay={0.5} ></Typewriter>
         </div>
         
         <BoxReveal boxColor={"#5046e6"} duration={0.5}>
         <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-4 sm:mt-6 lg:mt-8 w-full sm:w-auto py-4 sm:py-6 px-4 sm:px-6">
              <button 
              className="px-4 py-2 rounded-md border border-black dark:border-white bg-white dark:bg-gray-900 text-black dark:text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255)] transition duration-200"
              onClick={() => router.push('/blogs')}
              >
              浏览文章
              </button>
              <button 
              className="px-4 py-2 rounded-md border border-black dark:border-white bg-white dark:bg-gray-900 text-black dark:text-white text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255)] transition duration-200"
              onClick={() => router.push('/about')}
              >
              了解更多
              </button>
           </div>
         </BoxReveal>
         
        </div>
      </section>
    </div>
  );
}
