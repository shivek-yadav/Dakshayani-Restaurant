import test from 'node:test';
import assert from 'node:assert/strict';
import {slug,uid,validId,pick,clean,parse} from '../src/lib/utils.js';
test('slugs are stable and URL-safe',()=>{assert.equal(slug('  Royal Paneer & Cream!  '),'royal-paneer-cream');assert.equal(slug(''), '')});
test('generated order and booking numbers are unique and recognizable',()=>{const a=uid('DKO'),b=uid('DKO');assert.match(a,/^DKO-\d{8}-[A-F0-9]{8}$/);assert.notEqual(a,b)});
test('MongoDB ObjectIDs are checked before ownership queries',()=>{assert.ok(validId('507f1f77bcf86cd799439011'));assert.equal(validId('not-an-object-id'),false)});
test('whitelisted update fields ignore unwanted keys',()=>{assert.deepEqual(pick({name:'Dish',price:249,role:'admin'},['name','price']),{name:'Dish',price:249})});
test('serialized users do not expose password or reset secrets',()=>{const d=clean({_id:'507f1f77bcf86cd799439011',name:'Guest',passwordHash:'secret',resetTokenHash:'hash',__v:0});assert.equal(d.name,'Guest');assert.ok(!('passwordHash'in d));assert.ok(!('resetTokenHash'in d));assert.ok(!('__v'in d))});
test('validation helpers reject invalid inputs with status 400',()=>{const schema={safeParse:()=>({success:false,error:{issues:[{path:['name'],message:'Required'}]}})};assert.throws(()=>parse(schema,{}),e=>e.status===400&&e.message.includes('name'))});
