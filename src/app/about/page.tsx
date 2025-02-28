import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen py-12 px-4 md:px-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">About Us</h1>

        {/* CSI Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Computer Society of India (CSI)</h2>
              <p className="text-lg text-muted-foreground mb-4">
                The Computer Society of India (CSI) is the first and largest body of computer professionals in India.
                Formed in 1965, CSI has been instrumental in guiding the Indian IT industry down the right path since
                its formative years.
              </p>
              <p className="text-lg text-muted-foreground">
                Our student chapter focuses on bridging the gap between academia and industry by organizing workshops,
                seminars, coding competitions, and technical events that enhance students' knowledge and skills in the
                field of computing.
              </p>
            </div>
            <div className="flex justify-center">
              <Image
                src="/CSI-LOGO.png"
                alt="CSI Logo and Activities"
                width={400}
                height={200}
                className="rounded-lg"
              />
            </div>
          </div>
        </section>

        {/* COD Section */}
        {/* <section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1 flex justify-center">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="COD Events"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold mb-4">Club of Developers (COD)</h2>
              <p className="text-lg text-muted-foreground mb-4">
                The Club of Developers (COD) is a community of passionate programmers and developers dedicated to
                fostering innovation and technical excellence among students.
              </p>
              <p className="text-lg text-muted-foreground">
                We organize hackathons, coding challenges, development workshops, and collaborative projects that help
                students enhance their programming skills, learn new technologies, and prepare for industry demands. Our
                mission is to create a vibrant ecosystem where coding enthusiasts can learn, collaborate, and grow
                together.
              </p>
            </div>
          </div>
        </section> */}
      </div>
    </main>
  )
}

