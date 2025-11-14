# Guia de Uso do Carrinho (Cart)

## Visão Geral

A lógica de `Order` agora suporta funcionalidade de carrinho quando o status é `IN_CART`. Quando um pedido está neste status, é possível:

- Adicionar novos items
- Alterar a quantidade de items existentes
- Remover items
- Limpar todo o carrinho

## Endpoints

### 1. Criar um carrinho (Order com status IN_CART)

```bash
POST /order
Content-Type: application/json

{
  "userId": "uuid-do-usuario",
  "status": "IN_CART",
  "items": [
    {
      "productId": "uuid-do-produto",
      "quantity": 2
    }
  ]
}
```

### 2. Adicionar item ao carrinho

```bash
POST /order/:orderId/items
Content-Type: application/json

{
  "productId": "uuid-do-produto",
  "quantity": 1
}
```

**Nota:** Se o produto já existir no carrinho, a quantidade será incrementada.

### 3. Atualizar quantidade de um item

```bash
PATCH /order/:orderId/items/:itemId
Content-Type: application/json

{
  "quantity": 5
}
```

### 4. Remover um item do carrinho

```bash
DELETE /order/:orderId/items/:itemId
```

### 5. Limpar todo o carrinho

```bash
DELETE /order/:orderId/items
```

### 6. Converter carrinho em pedido

```bash
PATCH /order/:orderId
Content-Type: application/json

{
  "status": "PENDING"
}
```

Após alterar o status para qualquer valor diferente de `IN_CART`, o pedido não poderá mais ter items modificados.

## Regras de Negócio

1. **Apenas orders com status `IN_CART` podem ter items modificados** diretamente através dos endpoints específicos do carrinho.

2. **Adicionar item duplicado:** Se você tentar adicionar um produto que já está no carrinho, a quantidade será somada ao item existente.

3. **Recálculo automático:** Sempre que um item é adicionado, removido ou tem sua quantidade alterada, o `totalAmount` da order é recalculado automaticamente.

4. **Validações:**
   - O produto deve existir
   - A quantidade deve ser no mínimo 1
   - O pedido deve existir e ter status `IN_CART`

## Fluxo Típico

```javascript
// 1. Criar um carrinho vazio ou com items iniciais
const cart = await fetch('/order', {
  method: 'POST',
  body: JSON.stringify({
    userId: 'user-123',
    status: 'IN_CART',
    items: [],
  }),
});

// 2. Adicionar produtos ao carrinho
await fetch(`/order/${cart.id}/items`, {
  method: 'POST',
  body: JSON.stringify({
    productId: 'product-1',
    quantity: 2,
  }),
});

// 3. Atualizar quantidade
await fetch(`/order/${cart.id}/items/${itemId}`, {
  method: 'PATCH',
  body: JSON.stringify({
    quantity: 5,
  }),
});

// 4. Finalizar compra (converter para pedido)
await fetch(`/order/${cart.id}`, {
  method: 'PATCH',
  body: JSON.stringify({
    status: 'PENDING',
  }),
});
```

## Status Disponíveis

- `IN_CART` - Carrinho ativo (permite modificações)
- `PENDING` - Pedido pendente de pagamento
- `PAID` - Pedido pago
- `SHIPPED` - Pedido enviado
- `DELIVERED` - Pedido entregue
- `CANCELED` - Pedido cancelado
