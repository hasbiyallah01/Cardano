"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchDatum = exports.BatchDatumSchema = exports.InitSubscription = exports.SubscribeMintSchema = exports.PaymentValidatorDatum = exports.PaymentValidatorDatumSchema = exports.PenaltyDatum = exports.PenaltyDatumSchema = exports.PaymentDatum = exports.PaymentDatumSchema = exports.Installment = exports.InstallmentSchema = exports.CreateServiceRedeemer = exports.ServiceDatum = exports.ServiceDatumSchema = exports.CreateAccountRedeemer = exports.AccountDatum = exports.AccountDatumSchema = exports.DeleteMintSchema = exports.CreateMintSchema = exports.Value = exports.ValueSchema = exports.AddressD = exports.AddressSchema = exports.CredentialD = exports.CredentialSchema = void 0;
var lucid_1 = require("@lucid-evolution/lucid");
exports.CredentialSchema = lucid_1.Data.Enum([
    lucid_1.Data.Object({
        PublicKeyCredential: lucid_1.Data.Tuple([
            lucid_1.Data.Bytes({ minLength: 28, maxLength: 28 }),
        ]),
    }),
    lucid_1.Data.Object({
        ScriptCredential: lucid_1.Data.Tuple([
            lucid_1.Data.Bytes({ minLength: 28, maxLength: 28 }),
        ]),
    }),
]);
exports.CredentialD = exports.CredentialSchema;
exports.AddressSchema = lucid_1.Data.Object({
    paymentCredential: exports.CredentialSchema,
    stakeCredential: lucid_1.Data.Nullable(lucid_1.Data.Enum([
        lucid_1.Data.Object({ Inline: lucid_1.Data.Tuple([exports.CredentialSchema]) }),
        lucid_1.Data.Object({
            Pointer: lucid_1.Data.Tuple([
                lucid_1.Data.Object({
                    slotNumber: lucid_1.Data.Integer(),
                    transactionIndex: lucid_1.Data.Integer(),
                    certificateIndex: lucid_1.Data.Integer(),
                }),
            ]),
        }),
    ])),
});
exports.AddressD = exports.AddressSchema;
exports.ValueSchema = lucid_1.Data.Map(lucid_1.Data.Bytes(), lucid_1.Data.Map(lucid_1.Data.Bytes(), lucid_1.Data.Integer()));
exports.Value = exports.ValueSchema;
// Mint Redeemers
exports.CreateMintSchema = lucid_1.Data.Object({
    input_index: lucid_1.Data.Integer(),
    output_index: lucid_1.Data.Integer(),
});
exports.DeleteMintSchema = lucid_1.Data.Object({
    reference_token_name: lucid_1.Data.Bytes(),
});
// Account
exports.AccountDatumSchema = lucid_1.Data.Object({
    email_hash: lucid_1.Data.Bytes(),
    phone_hash: lucid_1.Data.Bytes(),
});
exports.AccountDatum = exports.AccountDatumSchema;
exports.CreateAccountRedeemer = exports.CreateMintSchema;
// Service
exports.ServiceDatumSchema = lucid_1.Data.Object({
    service_fee_policyid: lucid_1.Data.Bytes(),
    service_fee_assetname: lucid_1.Data.Bytes(),
    service_fee: lucid_1.Data.Integer(),
    penalty_fee_policyid: lucid_1.Data.Bytes(),
    penalty_fee_assetname: lucid_1.Data.Bytes(),
    penalty_fee: lucid_1.Data.Integer(),
    interval_length: lucid_1.Data.Integer(),
    num_intervals: lucid_1.Data.Integer(),
    is_active: lucid_1.Data.Boolean(),
});
exports.ServiceDatum = exports.ServiceDatumSchema;
exports.CreateServiceRedeemer = exports.CreateMintSchema;
// Payment
exports.InstallmentSchema = lucid_1.Data.Object({
    claimable_at: lucid_1.Data.Integer(),
    claimable_amount: lucid_1.Data.Integer(),
});
exports.Installment = exports.InstallmentSchema;
exports.PaymentDatumSchema = lucid_1.Data.Object({
    service_nft_tn: lucid_1.Data.Bytes(),
    subscriber_nft_tn: lucid_1.Data.Bytes(),
    subscription_start: lucid_1.Data.Integer(),
    subscription_end: lucid_1.Data.Integer(),
    original_subscription_end: lucid_1.Data.Integer(),
    installments: lucid_1.Data.Array(exports.InstallmentSchema),
});
exports.PaymentDatum = exports.PaymentDatumSchema;
exports.PenaltyDatumSchema = lucid_1.Data.Object({
    service_nft_tn: lucid_1.Data.Bytes(),
    subscriber_nft_tn: lucid_1.Data.Bytes(),
});
exports.PenaltyDatum = exports.PenaltyDatumSchema;
exports.PaymentValidatorDatumSchema = lucid_1.Data.Enum([
    lucid_1.Data.Object({ Payment: lucid_1.Data.Tuple([exports.PaymentDatumSchema]) }),
    lucid_1.Data.Object({ Penalty: lucid_1.Data.Tuple([exports.PenaltyDatumSchema]) }),
]);
exports.PaymentValidatorDatum = exports.PaymentValidatorDatumSchema;
exports.SubscribeMintSchema = lucid_1.Data.Object({
    service_ref_input_index: lucid_1.Data.Integer(),
    subscriber_input_index: lucid_1.Data.Integer(),
    payment_output_index: lucid_1.Data.Integer(),
});
exports.InitSubscription = exports.SubscribeMintSchema;
exports.BatchDatumSchema = lucid_1.Data.Object({
    productName: lucid_1.Data.Bytes(),
    batchId: lucid_1.Data.Bytes(),
    units: lucid_1.Data.Integer(),
    ingredients: lucid_1.Data.Array(lucid_1.Data.Bytes()),
    manufacturer: lucid_1.Data.Bytes(),
    productionDate: lucid_1.Data.Bytes(),
    expiryDate: lucid_1.Data.Bytes()
});
exports.BatchDatum = exports.BatchDatumSchema;
var sample1 = {
    productName: "TestProduct",
    batchId: "BATCH001",
    units: 20n,
    ingredients: ["sugar", "salt"],
    manufacturer: "Hasbiy Industries",
    productionDate: "2025-05-30",
    expiryDate: "2026-05-30"
};
