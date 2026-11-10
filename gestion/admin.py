from django.contrib import admin
from .models import Cliente, Proveedor, Servicio, Factura, Pago


@admin.register(Cliente)
class ClienteAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'correo', 'telefono', 'documento')
    search_fields = ('nombre', 'correo', 'documento')


@admin.register(Proveedor)
class ProveedorAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'nit', 'telefono', 'correo')
    search_fields = ('nombre', 'nit')


@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'categoria', 'proveedor', 'activo')
    list_filter = ('categoria', 'activo')
    search_fields = ('nombre', 'proveedor__nombre')


@admin.register(Factura)
class FacturaAdmin(admin.ModelAdmin):
    list_display = (
        'numero_factura',
        'cliente',
        'servicio',
        'valor',
        'fecha_emision',
        'fecha_vencimiento',
        'estado'
    )
    list_filter = ('estado', 'fecha_emision')
    search_fields = ('numero_factura', 'cliente__nombre')


@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = (
        'referencia',
        'factura',
        'valor',
        'fecha_pago',
        'metodo_pago',
        'estado'
    )
    list_filter = ('estado', 'metodo_pago')
    search_fields = ('referencia', 'factura__numero_factura')