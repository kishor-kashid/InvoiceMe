/**
 * LineItemForm Component - Dynamic line item management for invoices
 */

'use client';

import { Button, Input } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';

export interface LineItemData {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface LineItemFormProps {
  lineItems: LineItemData[];
  onChange: (items: LineItemData[]) => void;
  errors?: Record<number, string>;
  disabled?: boolean;
  currency?: string;
}

export default function LineItemForm({ lineItems, onChange, errors, disabled = false, currency = 'USD' }: LineItemFormProps) {
  const updateLineItem = (index: number, field: keyof LineItemData, value: string | number): void => {
    const updated = [...lineItems];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    // Calculate amount
    if (field === 'quantity' || field === 'unitPrice') {
      updated[index].amount = updated[index].quantity * updated[index].unitPrice;
    }

    onChange(updated);
  };

  const addLineItem = (): void => {
    onChange([
      ...lineItems,
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        amount: 0,
      },
    ]);
  };

  const removeLineItem = (index: number): void => {
    if (lineItems.length > 1) {
      const updated = lineItems.filter((_, i) => i !== index);
      onChange(updated);
    }
  };

  const totalAmount = lineItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Line Items</h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addLineItem}
          disabled={disabled}
        >
          + Add Item
        </Button>
      </div>

      <div className="space-y-3">
        {lineItems.map((item, index) => (
          <div
            key={item.id || index}
            className="grid grid-cols-12 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
          >
            <div className="col-span-12 md:col-span-5">
              <Input
                label="Description"
                value={item.description}
                onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                placeholder="Item description"
                error={errors?.[index]?.includes('Description') ? errors[index] : undefined}
                disabled={disabled}
                required
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <Input
                label="Quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={item.quantity}
                onChange={(e) => updateLineItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                error={errors?.[index]?.includes('Quantity') ? errors[index] : undefined}
                disabled={disabled}
                required
              />
            </div>
            <div className="col-span-4 md:col-span-2">
              <Input
                label="Unit Price"
                type="number"
                min="0"
                step="0.01"
                value={item.unitPrice}
                onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                error={errors?.[index]?.includes('Unit price') ? errors[index] : undefined}
                disabled={disabled}
                required
              />
            </div>
            <div className="col-span-3 md:col-span-2 flex items-end">
              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <div className="px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-semibold text-gray-900">
                  {formatCurrency(item.amount, currency)}
                </div>
              </div>
            </div>
            <div className="col-span-1 flex items-end">
              {lineItems.length > 1 && (
                <Button
                  type="button"
                  variant="danger"
                  size="sm"
                  onClick={() => removeLineItem(index)}
                  disabled={disabled}
                  className="w-full"
                >
                  ×
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <div className="text-right">
          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount, currency)}</p>
        </div>
      </div>
    </div>
  );
}

