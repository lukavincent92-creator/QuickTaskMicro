import Layout from "@/components/layout";
import { MessageSquare } from "lucide-react";

export default function Messages() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center space-y-4">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
          <MessageSquare size={40} />
        </div>
        <h1 className="text-2xl font-display font-bold">Messages</h1>
        <p className="text-muted-foreground max-w-xs">
          Chat with clients and workers here. This feature is coming in the next update!
        </p>
      </div>
    </Layout>
  );
}
