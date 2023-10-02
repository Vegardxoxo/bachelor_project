from rest_framework import permissions


class IsUnitHead(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_unit_head
