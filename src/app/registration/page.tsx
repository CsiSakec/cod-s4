import RegistrationForm from "@/components/registration-form"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-blue-50 to-white bg-black">
      <div className="max-w-4xl mx-auto ">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Event Registration 🎉</h1>
        <p className="text-center text-gray-600 mb-8">Fill out the form below to register for the event</p>
        <RegistrationForm />
      </div>
    </main>
  )
}

