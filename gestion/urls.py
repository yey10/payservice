from rest_framework.routers import DefaultRouter

from .views import (
    ClienteViewSet,
    ProveedorViewSet,
    ServicioViewSet,
    FacturaViewSet,
    PagoViewSet
)

router = DefaultRouter()

router.register('clientes', ClienteViewSet)
router.register('proveedores', ProveedorViewSet)
router.register('servicios', ServicioViewSet)
router.register('facturas', FacturaViewSet)
router.register('pagos', PagoViewSet)

urlpatterns = router.urls