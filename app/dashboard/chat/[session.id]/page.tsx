import UserDashboard from "@/app/ui/user-dashboard";

// Define the type to match your folder: [session.id]
type Props = {
  params: Promise<{ 'session.id': string }>
}

export default async function ChatSessionPage({ params }: Props) {
 
  const resolvedParams = await params;
  const sessionId = resolvedParams['session.id'];

  return <UserDashboard sessionId={sessionId} />;
}