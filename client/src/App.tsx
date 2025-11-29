import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/landing";
import Auth from "@/pages/auth";
import WorkerDashboard from "@/pages/worker-dashboard";
import ClientDashboard from "@/pages/client-dashboard";
import CreateMission from "@/pages/create-mission";
import MissionDetails from "@/pages/mission-details";
import Profile from "@/pages/profile";
import Messages from "@/pages/messages";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/auth" component={Auth} />
      <Route path="/dashboard" component={WorkerDashboard} />
      <Route path="/client-dashboard" component={ClientDashboard} />
      <Route path="/create-mission" component={CreateMission} />
      <Route path="/mission/:id" component={MissionDetails} />
      <Route path="/profile" component={Profile} />
      <Route path="/messages" component={Messages} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
