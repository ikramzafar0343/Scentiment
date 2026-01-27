import { Button } from '@/components/ui/Button';
import { Mail } from 'lucide-react';

export function NewsletterSection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container-custom text-center max-w-3xl mx-auto px-4">
        <div className="flex justify-center mb-6">
           <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
             <Mail className="w-6 h-6 text-white" />
           </div>
        </div>
        <h2 className="text-3xl font-bold mb-3 tracking-wider uppercase font-serif">Join the Inner Circle</h2>
        <p className="text-gray-300 mb-10 text-base leading-relaxed">
          Sign up for exclusive offers, early access to new drops, and expert scent styling tips.
          <br className="hidden sm:block"/> Plus, get 10% off your first order.
        </p>
        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto w-full" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Enter your email address" 
            className="flex-1 bg-white/5 border border-white/20 rounded-sm px-4 py-3 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-sm placeholder:text-gray-500 text-white"
            required
          />
          <Button 
            variant="secondary" 
            className="uppercase text-xs tracking-widest whitespace-nowrap px-8 h-auto py-3"
            type="submit"
          >
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-[10px] text-gray-500 uppercase tracking-wide">
          By signing up, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </section>
  )
}
