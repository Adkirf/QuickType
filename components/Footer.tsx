import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground p-4 mt-auto">
      <div className="container mx-auto flex justify-center space-x-4">
        <Link href="/privacy" className="hover:underline">
          Privacy Policy
        </Link>
        <Link href="/terms" className="hover:underline">
          Terms of Service
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact Us
        </Link>
      </div>
    </footer>
  )
}
