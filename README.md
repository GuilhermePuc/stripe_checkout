# Integrate Stripe Checkout with Node.js

Integrate Stripe Checkout with Node.js and Express.

### Version: 1.0.0

### Usage

```sh
$ npm install
```

```sh
$ node index
```

Opção de checkout pelo navegador

1. Acesse http://localhost:3005
2. Informe nome e e-mail para cadastramento do cliente no Stripe e clique em Proceed to Checkout

Opção via API Rest

2. Acessar http://127.0.0.1:3005/checkout
3. Informar payload no Body

{
    "email": "EMAIL_DO_CLIENTE",
    "name": "NOME_DO_CLIENTE",
    "items": [
        {
            "price_data": {
                "currency": "brl",
                "product_data": {
                    "name": "NOME DO PRODUTO"
                },
                "unit_amount": 6500 (Neste exemplo o valor é 65,00)
            },
            "quantity": 3
        },
        {
            "price_data": {
                "currency": "brl",
                "product_data": {
                    "name": "Passagem Ida e Volta Criança 4-10 anos"
                },
                "unit_amount": 4000
            },
            "quantity": 2
        }
    ],
    "success_url": "http://127.0.0.1:3005/complete?session_id={CHECKOUT_SESSION_ID}",
    "cancel_url": "http://127.0.0.1:3005/"
}
