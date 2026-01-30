import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Seo } from '@/components/seo/Seo';
import { PageHeader } from '@/components/ui/layout/PageHeader';
import { PageContainer } from '@/components/ui/layout/PageContainer';
import { Card } from '@/components/ui/layout/Card';
import { TextField } from '@/components/ui/form/TextField';
import { TextArea } from '@/components/ui/form/TextArea';

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
    <div className="page-surface">
      <Seo
        title="Contact — AROMAZUR"
        description="Discover the refined elegance of the French Riviera. Contact AROMAZUR for guidance on selecting fragrances inspired by Grasse's perfumery heritage."
        canonicalPath="/contact"
      />

      <PageHeader
        eyebrow="Support"
        title="Contact"
        description="Need guidance selecting a fragrance that reflects the delicate balance of nature, emotion, and savoir‑faire? Our team is here to help you discover the essence of the French Riviera."
      />
      
      <PageContainer className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl">
          {isSubmitted ? (
            <Card className="p-8 text-center">
              <h3 className="text-2xl font-semibold text-gray-900">Message sent</h3>
              <p className="ui-lead mt-2">Thanks for reaching out. We’ll get back to you shortly.</p>
              <Button className="mt-7" onClick={() => setIsSubmitted(false)}>
                Send another message
              </Button>
            </Card>
          ) : (
            <Card className="p-6 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <TextField
                  label="Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  autoComplete="name"
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  autoComplete="email"
                />

                <TextArea
                  label="Message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  error={errors.message}
                />

                <Button type="submit" className="w-full" size="lg">
                  Send message
                </Button>
              </form>
            </Card>
          )}
        </div>
      </PageContainer>
    </div>
  );
}
