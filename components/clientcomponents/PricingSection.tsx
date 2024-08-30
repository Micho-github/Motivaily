import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";

export default function PricingSection() {
  return (
    <section className="w-full py-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="mb-12 inline-block border-2 border-muted rounded-lg px-3 py-1 text-sm">
              💵 Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Pricing Plans
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that best suits your needs. No hidden fees, ever.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {/* Free Plan */}
          <div className="bg-background rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-card">
              <h3 className="text-xl font-bold">Starter</h3>
              <p className="text-muted-foreground mt-2">
                Ideal for individuals who want to get started with basic
                features.
              </p>
              <div className="flex items-baseline mt-6">
                <span className="text-4xl font-bold">Free</span>
              </div>
            </div>
            <div className="bg-card pr-6 pl-6">
            <Separator className="bg-primary" />
            </div>
            <div className="p-6 bg-card">
              <ul className="space-y-2 text-foreground">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-secondary" />5 active tasks
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-secondary" />
                  Basic task management
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-secondary" />
                  Email support
                </li>
              </ul>
            </div>
            <div className="p-6 bg-card">
              <Button className="w-full bg-secondary hover:bg-secondary-hover text-white">
                Sign Up
              </Button>
            </div>
          </div>

          {/* Paid Plan */}
          <div className="bg-background rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-card">
              <h3 className="text-xl font-bold">Paid</h3>
              <p className="text-muted-foreground mt-2">
                Perfect for individuals and small teams who need more advanced
                features.
              </p>
              <div className="flex items-baseline mt-6">
                <span className="text-4xl font-bold">$5</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </div>
            <div className="bg-card pr-6 pl-6">
            <Separator className="bg-primary" />
            </div>
            <div className="p-6 bg-card">
              <ul className="space-y-2 text-foreground">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-secondary" />
                  50 active tasks
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-secondary" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-secondary" />
                  Advanced features
                </li>
              </ul>
            </div>
            <div className="p-6 bg-card">
              <Button className="w-full bg-secondary hover:bg-secondary-hover text-white">
                Get Started
              </Button>
            </div>
          </div>

          {/* Corporate Plan */}
          <div className="bg-background rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-card">
              <h3 className="text-xl font-bold">Corporate</h3>
              <p className="text-muted-foreground mt-2">
                Tailored for large teams and organizations with comprehensive
                needs.
              </p>
              <div className="flex items-baseline mt-6">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>
            </div>
            <div className="bg-card pr-6 pl-6">
            <Separator className="bg-primary" />
            </div>
            <div className="p-6 bg-card">
              <ul className="space-y-2 text-foreground">
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-secondary" />
                  Unlimited active tasks
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-secondary" />
                  Dedicated support
                </li>
                <li className="flex items-center gap-2">
                  <CheckIcon className="w-5 h-5 text-secondary" />
                  Custom integrations
                </li>
              </ul>
            </div>
            <div className="p-6 bg-card">
              <Button className="w-full bg-secondary hover:bg-secondary-hover text-white">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
