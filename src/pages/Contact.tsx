import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      // Simulate API call
      setTimeout(() => {
        setIsSubmitted(true);
      }, 1000);
    }
  };

  return (
    <div className="container-custom py-16 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 uppercase tracking-widest">Contact Us</h1>
      
      {isSubmitted ? (
        <div className="text-center bg-green-50 p-8 rounded-lg border border-green-100">
          <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
          <p className="text-green-700">Thank you for contacting Scentiment. We will get back to you shortly.</p>
          <Button className="mt-6" onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              id="name"
              className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-black transition-colors`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-black transition-colors`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              id="message"
              rows={5}
              className={`w-full px-4 py-3 border ${errors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-black transition-colors`}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </div>
          
          <Button type="submit" className="w-full" size="lg">Send Message</Button>
        </form>
      )}
    </div>
  );
}
