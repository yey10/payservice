from django.db import models

class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20)
    documento = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.nombre

class Proveedor(models.Model):
    nombre = models.CharField(max_length=100)
    nit = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=20)
    correo = models.EmailField()

    def __str__(self):
        return self.nombre

class Servicio(models.Model):

    nombre = models.CharField(max_length=100)
    categoria = models.CharField(max_length=50)
    descripcion = models.TextField()
    proveedor = models.ForeignKey(
        Proveedor,
        on_delete=models.PROTECT,
        related_name='servicios'
    )
    activo = models.BooleanField(default=True)

    def __str__(self):
        return self.nombre

class Factura(models.Model):

    class Estado(models.TextChoices):
        PENDIENTE = 'pendiente', 'Pendiente'
        PARCIAL = 'parcial', 'Pago parcial'
        PAGADA = 'pagada', 'Pagada'

    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        related_name='facturas'
    )

    servicio = models.ForeignKey(
        Servicio,
        on_delete=models.PROTECT,
        related_name='facturas'
    )

    numero_factura = models.CharField(
        max_length=30,
        unique=True
    )

    valor = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    fecha_emision = models.DateField()
    fecha_vencimiento = models.DateField()

    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.PENDIENTE
    )

    def __str__(self):
        return self.numero_factura

class Pago(models.Model):

    class Estado(models.TextChoices):
        APROBADO = 'aprobado', 'Aprobado'
        RECHAZADO = 'rechazado', 'Rechazado'

    factura = models.ForeignKey(
        Factura,
        on_delete=models.PROTECT,
        related_name='pagos'
    )

    valor = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    fecha_pago = models.DateTimeField(auto_now_add=True)

    metodo_pago = models.CharField(max_length=30)

    estado = models.CharField(
        max_length=20,
        choices=Estado.choices,
        default=Estado.APROBADO
    )

    referencia = models.CharField(
        max_length=50,
        unique=True
    )

    def __str__(self):
        return self.referencia