// components/product-forms/DefaultForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Basic contact schema for the default form
const defaultContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please provide more details about your requirements"),
  agreeToTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

type DefaultFormData = z.infer<typeof defaultContactSchema>;

interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  stripePriceId?: string;
  stripeProductId?: string;
  slug: string;
  productId?: string; // Added since you're using this in handleFormSubmit
}

interface DefaultFormProps {
  product: Product;
  schema: z.ZodType<unknown>;
  onChange: (data: Partial<DefaultFormData>) => void;
  onSubmit: (data: DefaultFormData & { productName: string; productId: string; requestType: string }) => void;
}

const DefaultForm = ({ product, schema, onChange, onSubmit }: DefaultFormProps) => {
  const [submitted, setSubmitted] = useState(false);
  
  // Use the default schema instead of the one provided (which might be an empty object)
  const { register, handleSubmit, watch, formState: { errors } } = useForm<DefaultFormData>({
    resolver: zodResolver(defaultContactSchema),
    defaultValues: {
      agreeToTerms: false,
    },
  });
  
  const formValues = watch();
  
  // Update parent component with form values
  React.useEffect(() => {
    onChange(formValues);
  }, [formValues, onChange]);
  
  const handleFormSubmit = (data: DefaultFormData) => {
    setSubmitted(true);
    onSubmit({
      ...data,
      productName: product.name,
      productId: product.productId,
      requestType: "custom",
    });
  };
  
  if (submitted) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-md text-center">
        <h3 className="text-lg font-medium text-green-800 mb-2">Thank you for your inquiry!</h3>
        <p className="text-green-600">We&apos;ve received your request for a custom {product.name} document.</p>
        <p className="text-green-600 mt-2">Our team will contact you shortly to discuss your specific requirements.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="text-blue-700">
          We&apos;re currently building a custom form for {product.name}. In the meantime, 
          please use this general inquiry form to request this document with your specific requirements.
        </p>
      </div>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            {...register("name")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Email Address</label>
          <input
            type="email"
            {...register("email")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Phone Number (Optional)</label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div className="form-group">
          <label className="block text-sm font-medium mb-1">Document Requirements</label>
          <textarea
            {...register("message")}
            rows={4}
            placeholder={`Please describe your specific needs for the ${product.name} document.`}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>
          )}
        </div>
        
        <div className="form-group">
          <label className="flex items-center">
            <input
              type="checkbox"
              {...register("agreeToTerms")}
              className="mr-2"
            />
            <span className="text-sm">
              I agree to the terms and conditions
            </span>
          </label>
          {errors.agreeToTerms && (
            <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms.message}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default DefaultForm;