import ChatContainer from "@/components/chat/chat-container";
import { getAllUsers, getCurrentUser, getUserById } from "@/lib/clerkUtils";
import { Divide } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const defaultButtonVariant = buttonVariants({ variant: "default" });
  return (
    <section className="w-full  py-8 md:py-8 lg:py-8">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 items-center">
          <div className="flex flex-col justify-center space-y-8 text-center">
            <div className="space-y-8">
              <h1 className="sm:min-h-[70px] text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r dark:from-white dark:to-gray-500 from-black to-gray-600 ">
                Its nice to share ;).
              </h1>
              <p className="max-w-[600px] text-zinc-600 md:text-xl dark:text-zinc-100 mx-auto">
                Share code snippets with fellow nerds.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-left pb-8">
              <h2 className="text-2xl font-bold">About CodeChat </h2>
              <p>
                {" "}
                Welcome to CodeChat, your ultimate destination for seamless code
                sharing and collaboration! CodeChat is not just another
                messaging app; it&apos;s a dynamic platform designed
                specifically for developers, programmers, and coding
                enthusiasts. Whether you&apos;re a seasoned developer or just
                starting on your coding journey, our app empowers you to
                effortlessly share, discuss, and learn from code snippets within
                the context of a conversation.
              </p>{" "}
              <h2 className="text-2xl font-bold">Why CodeChat?</h2>
              <strong>1.Real-time Code Sharing:</strong> Say goodbye to the
              hassle of copying and pasting code snippets from one text editor
              to another. With CodeChat, you can send and receive
              syntax-highlighted code snippets in real-time, making it easier
              than ever to collaborate on coding projects, debug issues, or
              share your latest creations.{" "}
              <strong>2. Contextual Conversations:</strong> CodeChat integrates
              code snippets seamlessly into your conversations. Discuss code
              with your peers, provide code reviews, or seek help with coding
              problems, all within the same chat window. No need to switch
              between apps or screens! <strong>3. Language Agnostic:</strong>{" "}
              Whether you&apos;re coding in Python, JavaScript, Java, C++, or
              any other programming language, CodeChat supports syntax
              highlighting for a wide range of languages, ensuring that your
              code is displayed accurately and beautifully.{" "}
              <strong>4. Secure and Private:</strong> We prioritize your data
              privacy and security. CodeChat employs robust encryption protocols
              to keep your code and conversations safe from prying eyes. You can
              code with confidence, knowing that your intellectual property
              remains protected. 8. Cross-Platform:** CodeChat is available on
              all major platforms, including iOS, Android, and the web. Stay
              connected and code on the go, no matter which device you prefer.
              <h2 className="font-bold text-2xl">Get Started Today!</h2>
              Experience a new era of code sharing and collaboration with
              CodeChat. Whether you&apos;re working on a complex project,
              seeking assistance with coding challenges, or simply sharing your
              coding achievements, CodeChat is the perfect platform to make
              coding conversations more engaging, productive, and enjoyable.
              Join our community of passionate developers today and elevate your
              coding experience to new heights. Download CodeChat now and start
              sharing your code in style!
              <h2 className="text-2xl font-bold">
                Got questions or feedback?{" "}
              </h2>
              <p>
                <Link className="font-bold" href="/contact">
                  Contact us.
                </Link>{" "}
                We&apos;d love to hear from you and help you make the most of
                your coding journey with CodeChat. Happy coding!
              </p>
            </div>

            <div className="w-full max-w-sm space-y-2 mx-auto">
              <div>
                <Link href="/app" className={`p-4 ${defaultButtonVariant}`}>
                  Start Chatting
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
