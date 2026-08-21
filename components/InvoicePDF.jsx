import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        backgroundColor: '#ffffff',
    },
    headerBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 10,
        backgroundColor: '#2563eb', // blue-600
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        marginTop: 10,
    },
    companyBox: {
        flexDirection: 'column',
        gap: 5,
    },
    logoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    logo: {
        width: 40,
        height: 40,
        backgroundColor: '#2563eb',
        color: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginRight: 10,
    },
    logoText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    brandName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    brandTag: {
        fontSize: 8,
        color: '#2563eb',
        textTransform: 'uppercase',
    },
    companyInfo: {
        fontSize: 9,
        color: '#64748b',
        lineHeight: 1.4,
    },
    invoiceDetailsBox: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        padding: '4 8',
        backgroundColor: '#eff6ff',
        color: '#1d4ed8',
        borderRadius: 12,
        fontSize: 8,
        textTransform: 'uppercase',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#dbeafe',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0f172a',
        textTransform: 'uppercase',
    },
    invoiceNumber: {
        fontSize: 10,
        color: '#64748b',
        marginTop: 5,
    },
    invoiceDate: {
        fontSize: 10,
        color: '#0f172a',
        fontWeight: 'bold',
        marginTop: 3,
    },
    clientSection: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#f1f5f9',
        paddingVertical: 20,
        marginBottom: 30,
    },
    clientInfo: {
        flex: 1,
    },
    paymentInfo: {
        flex: 1,
    },
    sectionLabel: {
        fontSize: 8,
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginBottom: 10,
    },
    clientName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 4,
    },
    clientText: {
        fontSize: 10,
        color: '#475569',
        marginBottom: 2,
    },
    paymentText: {
        fontSize: 10,
        color: '#475569',
        marginBottom: 4,
    },
    table: {
        width: 'auto',
        marginBottom: 30,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: '#0f172a',
        paddingBottom: 8,
        marginBottom: 10,
    },
    colDescHeader: {
        flex: 4,
        fontSize: 8,
        color: '#0f172a',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
    colQtyHeader: {
        flex: 1,
        fontSize: 8,
        color: '#0f172a',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    colGarHeader: {
        flex: 2,
        fontSize: 8,
        color: '#0f172a',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    colTotalHeader: {
        flex: 2,
        fontSize: 8,
        color: '#0f172a',
        textTransform: 'uppercase',
        fontWeight: 'bold',
        textAlign: 'right',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#f1f5f9',
        paddingVertical: 12,
        alignItems: 'center',
    },
    colDesc: {
        flex: 4,
    },
    itemTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0f172a',
    },
    itemCat: {
        fontSize: 8,
        color: '#94a3b8',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    colQty: {
        flex: 1,
        fontSize: 10,
        color: '#334155',
        textAlign: 'center',
    },
    colGar: {
        flex: 2,
        fontSize: 10,
        color: '#334155',
        textAlign: 'right',
    },
    colTotal: {
        flex: 2,
        fontSize: 10,
        fontWeight: 'bold',
        color: '#0f172a',
        textAlign: 'right',
    },
    totalsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    guaranteeBox: {
        width: '50%',
        backgroundColor: '#eff6ff',
        padding: 15,
        borderRadius: 12,
    },
    guaranteeTitle: {
        fontSize: 8,
        color: '#1d4ed8',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 6,
    },
    guaranteeText: {
        fontSize: 8,
        color: '#3b82f6',
        lineHeight: 1.4,
    },
    totalsBox: {
        width: '40%',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabel: {
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 10,
        color: '#0f172a',
        fontWeight: 'bold',
    },
    totalRowHighlight: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    totalLabelHighlight: {
        fontSize: 10,
        color: '#2563eb',
        fontWeight: 'bold',
    },
    totalValueHighlight: {
        fontSize: 10,
        color: '#2563eb',
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 8,
    },
    grandTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    grandTotalLabel: {
        fontSize: 10,
        color: '#0f172a',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    grandTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#2563eb',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderColor: '#f1f5f9',
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ninea: {
        fontSize: 8,
        color: '#cbd5e1',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
});

const InvoicePDF = ({ order }) => {
    if (!order) return null;

    const date = new Date(order.createdAt).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    const isPaid = order.status === 'PAID' || order.status === 'DELIVERED';
    const subtotal = order.total - (order.deliveryFee || 0) + (order.discountAmount || 0);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.headerBar} />

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.companyBox}>
                        <View style={styles.logoBox}>
                            <View style={styles.logo}>
                                <Text style={styles.logoText}>GA</Text>
                            </View>
                            <View>
                                <Text style={styles.brandName}>GLOBAL AIR</Text>
                                <Text style={styles.brandTag}>L&apos;excellence au Sénégal</Text>
                            </View>
                        </View>
                        <Text style={styles.companyInfo}>
                            Avenue Cheikh Anta Diop, Fenêtre Mermoz
                        </Text>
                        <Text style={styles.companyInfo}>Dakar, Sénégal</Text>
                        <Text style={styles.companyInfo}>Tél: +221 77 783 27 98</Text>
                        <Text style={styles.companyInfo}>Email: contact@globalairsn.com</Text>
                    </View>

                    <View style={styles.invoiceDetailsBox}>
                        <Text style={styles.statusBadge}>
                            {isPaid ? 'Facture Payée' : 'À payer à la livraison'}
                        </Text>
                        <Text style={styles.title}>FACTURE</Text>
                        <Text style={styles.invoiceNumber}>
                            #INV-{order.id.slice(-6).toUpperCase()}
                        </Text>
                        <Text style={styles.invoiceDate}>{date}</Text>
                    </View>
                </View>

                {/* Client Section */}
                <View style={styles.clientSection}>
                    <View style={styles.clientInfo}>
                        <Text style={styles.sectionLabel}>Facturé à :</Text>
                        <Text style={styles.clientName}>
                            {order.address?.name || order.user?.name}
                        </Text>
                        <Text style={styles.clientText}>
                            {order.address?.street}, {order.address?.city}
                        </Text>
                        <Text style={styles.clientText}>{order.address?.phone}</Text>
                        <Text style={styles.clientText}>{order.address?.email}</Text>
                    </View>
                    <View style={styles.paymentInfo}>
                        <Text style={styles.sectionLabel}>Détails Paiement :</Text>
                        <Text style={styles.paymentText}>
                            Mode: {order.paymentMethod === 'COD' ? 'Cash' : order.paymentMethod}
                        </Text>
                        <Text style={styles.paymentText}>
                            Type:{' '}
                            {order.address?.name === 'Global Air Dakar' ? 'Retrait' : 'Livraison'}
                        </Text>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.colDescHeader}>Description</Text>
                        <Text style={styles.colQtyHeader}>Qté</Text>
                        <Text style={styles.colGarHeader}>Garantie</Text>
                        <Text style={styles.colTotalHeader}>Total</Text>
                    </View>

                    {order.orderItems?.map((item, index) => (
                        <View key={index} style={styles.tableRow}>
                            <View style={styles.colDesc}>
                                <Text style={styles.itemTitle}>{item.product?.name}</Text>
                                <Text style={styles.itemCat}>
                                    {item.product?.Category?.name || 'Électroménager'}
                                </Text>
                            </View>
                            <Text style={styles.colQty}>{item.quantity}</Text>
                            <Text style={styles.colGar}>{item.product?.guarantee || '6 mois'}</Text>
                            <Text style={styles.colTotal}>
                                {(item.price * item.quantity).toLocaleString('fr-SN')} F
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Totals Section */}
                <View style={styles.totalsSection}>
                    <View style={styles.guaranteeBox}>
                        <Text style={styles.guaranteeTitle}>Garantie & Support</Text>
                        <Text style={styles.guaranteeText}>
                            Ce document fait office de bon de garantie. Les durées de garantie sont
                            indiquées pour chaque article ci-dessus. Support technique disponible au
                            77 783 27 98.
                        </Text>
                    </View>

                    <View style={styles.totalsBox}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Sous-total</Text>
                            <Text style={styles.totalValue}>
                                {subtotal.toLocaleString('fr-SN')} F
                            </Text>
                        </View>
                        {order.discountAmount > 0 && (
                            <View style={styles.totalRowHighlight}>
                                <Text style={styles.totalLabelHighlight}>Réduction</Text>
                                <Text style={styles.totalValueHighlight}>
                                    -{Number(order.discountAmount).toLocaleString('fr-SN')} F
                                </Text>
                            </View>
                        )}
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Livraison</Text>
                            <Text style={styles.totalValue}>
                                {order.deliveryFee > 0
                                    ? `${Number(order.deliveryFee).toLocaleString('fr-SN')} F`
                                    : 'Gratuit'}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.grandTotalRow}>
                            <Text style={styles.grandTotalLabel}>Total Final</Text>
                            <Text style={styles.grandTotalValue}>
                                {Number(order.total).toLocaleString('fr-SN')} FCFA
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.ninea}>NINEA: 009876543 | RC: SN.DKR.2026.B.1234</Text>
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePDF;
