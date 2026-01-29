'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Heading,
  Text,
  Link,
  Button,
} from '@tekton/ui';

export default function UserProfileDashboard() {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card p-6 flex flex-col gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary" />
          <Heading level={3} className="text-xl font-bold">
            Tekton UI
          </Heading>
        </div>

        <nav className="flex flex-col gap-2">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md bg-accent text-accent-foreground font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Profile
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <Heading level={1}>User Profile</Heading>
            <Button variant="outline" size="sm">
              Download CV
            </Button>
          </div>

          <Card className="overflow-hidden border-none shadow-xl ring-1 ring-border/50">
            <CardHeader className="bg-primary/5 pb-16 pt-16 flex flex-col items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary blur-3xl" />
                <div className="absolute top-20 -left-10 w-32 h-32 rounded-full bg-primary blur-3xl opacity-50" />
              </div>

              <Avatar className="w-28 h-28 border-4 border-background shadow-2xl z-10">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&h=256&auto=format&fit=crop" />
                <AvatarFallback>SY</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-6 text-3xl font-bold z-10">Sooyeon Kim</CardTitle>
              <Text className="text-muted-foreground font-medium z-10">
                Product Designer @ Tekton
              </Text>
            </CardHeader>
            <CardContent className="p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-2">
                  <Text className="font-bold text-xs uppercase tracking-widest text-primary">
                    Email Address
                  </Text>
                  <Text className="text-lg">sooyeon@example.com</Text>
                </div>
                <div className="space-y-2">
                  <Text className="font-bold text-xs uppercase tracking-widest text-primary">
                    Location
                  </Text>
                  <Text className="text-lg">Seoul, South Korea</Text>
                </div>
                <div className="space-y-2">
                  <Text className="font-bold text-xs uppercase tracking-widest text-primary">
                    Role
                  </Text>
                  <Text className="text-lg">Senior Product Designer</Text>
                </div>
                <div className="space-y-2">
                  <Text className="font-bold text-xs uppercase tracking-widest text-primary">
                    Member Since
                  </Text>
                  <Text className="text-lg">January 2024</Text>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-4">
                  <Link
                    href="#"
                    className="text-sm font-medium hover:text-primary underline-offset-4 hover:underline"
                  >
                    LinkedIn
                  </Link>
                  <Link
                    href="#"
                    className="text-sm font-medium hover:text-primary underline-offset-4 hover:underline"
                  >
                    GitHub
                  </Link>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" className="px-6">
                    View Public Profile
                  </Button>
                  <Button className="px-6">Edit Profile Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
