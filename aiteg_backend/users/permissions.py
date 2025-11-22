from rest_framework import permissions

class IsAdminOrSuperAdmin(permissions.BasePermission):
    """
    Custom permission to only allow users with 'Admin' or 'Superadmin' roles access.
    Also ensures the user is authenticated (token check is implicit if using 
    DRF's default token/session authentication).
    """
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        user_role = getattr(request.user, 'role', None)
        print(user_role)

        if user_role in ['admin', 'superadmin']:
            return True
        
        return False