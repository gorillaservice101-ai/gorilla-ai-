import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProfit,
  getLineNotificationMessage,
  searchInventory,
  simulateAdminReply,
  validateRepairTicket,
  InventoryItem,
  RepairJob,
} from './storeLogic';

test('calculateProfit correctly calculates profit and margin percentage', () => {
  const result = calculateProfit(44900, 39900);
  assert.equal(result.profit, 5000);
  assert.equal(result.marginPercent, 11);

  const result2 = calculateProfit(22900, 19200);
  assert.equal(result2.profit, 3700);
  assert.equal(result2.marginPercent, 16);
});

test('getLineNotificationMessage creates correct message format for each status', () => {
  const sampleJob: RepairJob = {
    id: 'GOR-214',
    model: 'iPhone 14 Pro',
    customer: 'คุณมิกซ์',
    issue: 'จอแตก / แบตเสื่อม',
    status: 'รับเครื่อง',
    time: '09:32',
    color: '#00FF88',
  };

  const receivedMsg = getLineNotificationMessage(sampleJob);
  assert.ok(receivedMsg.includes('คุณมิกซ์'));
  assert.ok(receivedMsg.includes('GOR-214'));
  assert.ok(receivedMsg.includes('[รับเครื่อง]'));

  sampleJob.status = 'ซ่อมเสร็จ';
  const readyMsg = getLineNotificationMessage(sampleJob);
  assert.ok(readyMsg.includes('[ซ่อมเสร็จ]'));
  assert.ok(readyMsg.includes('สามารถเข้ามารับเครื่องได้เลยครับ'));
});

test('searchInventory matches by model, color or capacity', () => {
  const items: InventoryItem[] = [
    {
      model: 'iPhone 15 Pro Max',
      color: 'Natural Titanium',
      cap: '256GB',
      cost: 39900,
      price: 44900,
      stock: 3,
      status: 'พร้อมขาย',
      img: '📱',
    },
    {
      model: 'Samsung S23 Ultra',
      color: 'Cream',
      cap: '512GB',
      cost: 32000,
      price: 38900,
      stock: 4,
      status: 'พร้อมขาย',
      img: '🤖',
    },
  ];

  const results = searchInventory(items, 'Samsung');
  assert.equal(results.length, 1);
  assert.equal(results[0].model, 'Samsung S23 Ultra');

  const capResults = searchInventory(items, '256gb');
  assert.equal(capResults.length, 1);
  assert.equal(capResults[0].model, 'iPhone 15 Pro Max');
});

test('simulateAdminReply handles in-stock and out-of-stock inquiries', () => {
  const items: InventoryItem[] = [
    {
      model: 'iPhone 14 Pro',
      color: 'Deep Purple',
      cap: '128GB',
      cost: 28500,
      price: 32900,
      stock: 5,
      status: 'พร้อมขาย',
      img: '📱',
    },
    {
      model: 'Samsung S23',
      color: 'Phantom Black',
      cap: '256GB',
      cost: 18900,
      price: 23500,
      stock: 0,
      status: 'หมด',
      img: '🤖',
    },
  ];

  const inStockResult = simulateAdminReply('iPhone 14 Pro สีม่วงมีไหมครับ', items);
  assert.equal(inStockResult.canBook, true);
  assert.ok(inStockResult.reply.includes('32,900'));
  assert.ok(inStockResult.reply.includes('Deep Purple'));

  const outOfStockResult = simulateAdminReply('Samsung S23 สีดำ', items);
  assert.equal(outOfStockResult.canBook, false);
  assert.ok(outOfStockResult.reply.includes('หมดชั่วคราว'));
});

test('validateRepairTicket validates required fields properly', () => {
  const valid = validateRepairTicket({
    customer: 'คุณธนา',
    phone: '0891234567',
    model: 'iPhone 13',
    issue: 'เปลี่ยนจอแท้',
  });
  assert.equal(valid.isValid, true);

  const invalid = validateRepairTicket({
    customer: '',
    phone: 'invalid-number',
    model: '',
    issue: '',
  });
  assert.equal(invalid.isValid, false);
  assert.ok(invalid.errors.customer);
  assert.ok(invalid.errors.model);
  assert.ok(invalid.errors.issue);
});
