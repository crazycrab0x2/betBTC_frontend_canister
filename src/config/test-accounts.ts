import { Ed25519KeyIdentity } from '@dfinity/identity'

// wf3fv-4c4nr-7ks2b-xa4u7-kf3no-32glf-lf7e4-4ng4a-wwtlu-a2vnq-nae
const admin = Ed25519KeyIdentity.generate(new Uint8Array(32).fill(1))

// 52mr2-fw2ng-2ofst-7jekz-xbymo-3ysz7-itwdk-bgstz-r7g4g-oz5vi-pqe
const ali = Ed25519KeyIdentity.generate(new Uint8Array(32).fill(2))

// skpwg-42fe4-eyep5-nfyz7-66wvg-hthea-q3eek-vonbv-5wpxs-nxhmh-fqe
const bob = Ed25519KeyIdentity.generate(new Uint8Array(32).fill(3))

// ghaya-cncjm-ntxgt-af5pp-6hzsz-tvwlv-hrlfc-ocq3t-ai7vk-vyixr-cqe
const charlie = Ed25519KeyIdentity.generate(new Uint8Array(32).fill(4))

export const testAccounts = [
  { name: 'admin', identity: admin },
  { name: 'ali', identity: ali },
  { name: 'bob', identity: bob },
  { name: 'charlie', identity: charlie }
] as const

export type TestAccountKeys = (typeof testAccounts)[number]['name']
