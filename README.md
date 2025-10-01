# Sparrow Finance - AVAX Liquid Staking Interface

Production-ready React interface for Sparrow Finance liquid staking protocol.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### 3. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder.

---

## 📋 Features

- ✅ **Wallet Connection** - MetaMask & Core Wallet support
- ✅ **Stake AVAX** - Receive spAVAX liquid staking tokens
- ✅ **Real-time Stats** - APY, Total Staked, Your Balance
- ✅ **Exchange Rate** - Live spAVAX ↔ AVAX conversion
- ✅ **Network Detection** - Auto-detect and switch to Fuji
- ✅ **Dark Theme** - Beautiful gradient UI
- ✅ **Responsive** - Works on mobile & desktop
- ✅ **Toast Notifications** - User feedback for all actions

---

## 🔧 Configuration

### Contract Address

The contract is configured in `src/contracts/addresses.ts`:

```typescript
export const CONTRACTS = {
  fuji: {
    spAVAX: '0x8F8926A38D03125c448b5EF5f2Edbfc3BE8C69D2',
  },
  mainnet: {
    spAVAX: '', // Add mainnet address here
  },
};
```

### Network Settings

- **Fuji Testnet**: Chain ID 43113
- **Mainnet**: Chain ID 43114

---

## 📁 Project Structure

```
sparrow-finance-app/
├── src/
│   ├── components/
│   │   ├── StakingCard.tsx      # Main staking interface
│   │   ├── StatsCard.tsx        # Protocol statistics
│   │   └── ui/                  # Reusable UI components
│   ├── contracts/
│   │   ├── addresses.ts         # Contract addresses
│   │   └── spAVAX-abi.ts       # Contract ABI
│   ├── hooks/
│   │   ├── useWallet.ts         # Wallet connection logic
│   │   └── useContract.ts       # Contract interaction logic
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   ├── App.tsx                  # Main app component
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles
├── index.html                   # HTML entry point
├── package.json                 # Dependencies
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
└── tsconfig.json               # TypeScript config
```

---

## 🎨 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **ethers.js v6** - Blockchain interaction
- **Lucide React** - Icons
- **Sonner** - Toast notifications

---

## 🔗 Contract Integration

The app connects to your deployed spAVAX contract on Fuji testnet:

**Contract:** `0x8F8926A38D03125c448b5EF5f2Edbfc3BE8C69D2`  
**Explorer:** https://testnet.snowtrace.io/address/0x8F8926A38D03125c448b5EF5f2Edbfc3BE8C69D2

### Available Functions

**User Functions:**
- `stake()` - Stake AVAX for spAVAX
- `requestUnlock()` - Start unstaking process
- `claimUnlock()` - Claim AVAX after unlock period
- `balanceOf()` - Check spAVAX balance
- `getExchangeRate()` - Get current exchange rate

**View Functions:**
- `getStats()` - Get protocol statistics
- `totalPooledAVAX()` - Total AVAX staked
- `totalSupply()` - Total spAVAX supply

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Deploy automatically

### Option 2: Netlify

1. Run `npm run build`
2. Drag `dist/` folder to Netlify
3. Done!

### Option 3: GitHub Pages

1. Run `npm run build`
2. Push `dist/` to `gh-pages` branch
3. Enable GitHub Pages

### Option 4: IPFS (Decentralized)

1. Run `npm run build`
2. Upload `dist/` to IPFS
3. Pin with Pinata/Fleek

---

## 🧪 Testing

### Local Testing

1. Make sure you have MetaMask installed
2. Switch to Fuji Testnet
3. Get test AVAX from https://faucet.avax.network/
4. Run `npm run dev`
5. Connect wallet and test staking

### Test Checklist

- [ ] Wallet connects successfully
- [ ] Network detection works
- [ ] Can switch to Fuji testnet
- [ ] Balance displays correctly
- [ ] Can stake AVAX
- [ ] Receives spAVAX tokens
- [ ] Stats update after staking
- [ ] Exchange rate displays correctly
- [ ] Toast notifications work
- [ ] Responsive on mobile

---

## 🔐 Security Notes

- Contract is deployed and verified on Fuji
- All transactions require user approval
- Private keys never leave the wallet
- No backend server required
- All data fetched from blockchain

---

## 📝 Environment Variables

No environment variables needed! Everything is configured in the code.

---

## 🚨 Troubleshooting

### "Please install MetaMask"
- Install MetaMask or Core Wallet extension

### "Please switch to Avalanche Fuji Testnet"
- Click "Switch Network" button
- Or manually add Fuji in wallet settings

### "Insufficient AVAX balance"
- Get test AVAX from https://faucet.avax.network/

### Build errors
```bash
rm -rf node_modules
npm install
npm run dev
```

---

## 📞 Support

- **Contract:** https://testnet.snowtrace.io/address/0x8F8926A38D03125c448b5EF5f2Edbfc3BE8C69D2
- **Faucet:** https://faucet.avax.network/
- **Docs:** See project documentation

---

## 🎯 Next Steps

1. **Test thoroughly** on Fuji testnet
2. **Get feedback** from users
3. **Deploy to mainnet** after audit
4. **Add features:**
   - Unstaking interface
   - Transaction history
   - APY calculator
   - Multi-language support
   - BTC staking (Starknet)

---

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for the Avalanche ecosystem**
