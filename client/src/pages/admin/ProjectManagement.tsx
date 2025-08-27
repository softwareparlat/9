
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/api";
import {
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Settings,
  MessageCircle,
  Upload,
} from "lucide-react";

export default function ProjectManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["/api/admin/projects"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/projects");
      return await response.json();
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ projectId, updates }: { projectId: number; updates: any }) => {
      const response = await apiRequest("PUT", `/api/admin/projects/${projectId}`, updates);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({
        title: "Proyecto actualizado",
        description: "El proyecto ha sido actualizado exitosamente.",
      });
    },
  });

  const handleStatusUpdate = (projectId: number, status: string) => {
    updateProjectMutation.mutate({ projectId, updates: { status } });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Gestión de Proyectos">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gestión de Proyectos">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">
                    {projects?.filter((p: any) => p.status === 'pending')?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">En Desarrollo</p>
                  <p className="text-2xl font-bold">
                    {projects?.filter((p: any) => p.status === 'in_progress')?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Completados</p>
                  <p className="text-2xl font-bold">
                    {projects?.filter((p: any) => p.status === 'completed')?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <XCircle className="h-8 w-8 text-red-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Cancelados</p>
                  <p className="text-2xl font-bold">
                    {projects?.filter((p: any) => p.status === 'cancelled')?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Proyectos Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects?.map((project: any) => (
                <div key={project.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{project.name}</h3>
                      <p className="text-sm text-muted-foreground">{project.description}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant={
                          project.status === 'pending' ? 'outline' :
                          project.status === 'in_progress' ? 'secondary' :
                          project.status === 'completed' ? 'default' : 'destructive'
                        }>
                          {project.status === 'pending' ? 'Pendiente' :
                           project.status === 'in_progress' ? 'En Desarrollo' :
                           project.status === 'completed' ? 'Completado' : 'Cancelado'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          ${project.price}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {project.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(project.id, 'in_progress')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleStatusUpdate(project.id, 'cancelled')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Rechazar
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
