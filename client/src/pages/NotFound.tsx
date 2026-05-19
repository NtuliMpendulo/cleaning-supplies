import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container-custom py-24 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
      <p className="text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">
        Go Back Home
      </Link>
    </div>
  )
}
