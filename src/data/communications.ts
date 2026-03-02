export interface Message {
  id: string
  sender: 'client' | 'agent'
  senderName: string
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  clientId: string
  clientName: string
  channel: 'livechat' | 'whatsapp' | 'email' | 'phone'
  assignedTo?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  messages: Message[]
}

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    clientId: 'client-7',
    clientName: 'Wang Xiaoming',
    channel: 'livechat',
    assignedTo: 'user-sales-2',
    lastMessage: 'Thank you, I will try the bank transfer method now.',
    lastMessageTime: '2026-03-02T10:45:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1-1',
        sender: 'client',
        senderName: 'Wang Xiaoming',
        content:
          'Hi, I just got my KYC approved. How do I make my first deposit?',
        timestamp: '2026-03-02T10:30:00Z',
      },
      {
        id: 'msg-1-2',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'Congratulations on your KYC approval, Mr. Wang! You can deposit via bank transfer, credit card, or e-wallet. Which method would you prefer?',
        timestamp: '2026-03-02T10:32:00Z',
      },
      {
        id: 'msg-1-3',
        sender: 'client',
        senderName: 'Wang Xiaoming',
        content:
          'I prefer bank transfer. What are the details I need to use?',
        timestamp: '2026-03-02T10:35:00Z',
      },
      {
        id: 'msg-1-4',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'For bank transfer, please go to the Deposit section in your dashboard. Select "Bank Transfer" and you will see our bank details. The minimum deposit is $100 USD. Processing typically takes 1-2 business days.',
        timestamp: '2026-03-02T10:38:00Z',
      },
      {
        id: 'msg-1-5',
        sender: 'client',
        senderName: 'Wang Xiaoming',
        content: 'Thank you, I will try the bank transfer method now.',
        timestamp: '2026-03-02T10:45:00Z',
      },
    ],
  },
  {
    id: 'conv-2',
    clientId: 'client-8',
    clientName: 'Tanaka Hiroshi',
    channel: 'whatsapp',
    assignedTo: 'user-sales-3',
    lastMessage: 'I will upload the documents right away.',
    lastMessageTime: '2026-03-02T09:20:00Z',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-2-1',
        sender: 'client',
        senderName: 'Tanaka Hiroshi',
        content: 'Hello, my KYC verification has been pending for 3 days. Is there an issue?',
        timestamp: '2026-03-02T09:00:00Z',
      },
      {
        id: 'msg-2-2',
        sender: 'agent',
        senderName: 'Yuki Tanaka',
        content:
          'Good morning, Tanaka-san. Let me check your verification status. Could you confirm the email address associated with your account?',
        timestamp: '2026-03-02T09:05:00Z',
      },
      {
        id: 'msg-2-3',
        sender: 'client',
        senderName: 'Tanaka Hiroshi',
        content: 'It is hiroshi.t@example.jp.',
        timestamp: '2026-03-02T09:08:00Z',
      },
      {
        id: 'msg-2-4',
        sender: 'agent',
        senderName: 'Yuki Tanaka',
        content:
          'Thank you. I can see that your proof of address document was unclear. Could you please re-upload a utility bill or bank statement from the last 3 months?',
        timestamp: '2026-03-02T09:12:00Z',
      },
      {
        id: 'msg-2-5',
        sender: 'client',
        senderName: 'Tanaka Hiroshi',
        content: 'I see, that must have been the gas bill photo. I will upload a clearer scan.',
        timestamp: '2026-03-02T09:15:00Z',
      },
      {
        id: 'msg-2-6',
        sender: 'agent',
        senderName: 'Yuki Tanaka',
        content:
          'That would be great. Once uploaded, the review usually takes 24-48 hours. I will follow up with you as soon as it is processed.',
        timestamp: '2026-03-02T09:18:00Z',
      },
      {
        id: 'msg-2-7',
        sender: 'client',
        senderName: 'Tanaka Hiroshi',
        content: 'I will upload the documents right away.',
        timestamp: '2026-03-02T09:20:00Z',
      },
    ],
  },
  {
    id: 'conv-3',
    clientId: 'client-9',
    clientName: 'Sarah Johnson',
    channel: 'email',
    assignedTo: 'user-sales-1',
    lastMessage:
      'Dear Sarah, I have escalated this to our technical team. You should see the corrected spread within 24 hours.',
    lastMessageTime: '2026-03-01T16:30:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-3-1',
        sender: 'client',
        senderName: 'Sarah Johnson',
        content:
          'Subject: Spread discrepancy on EUR/USD\n\nHi, I noticed that the spread on EUR/USD on my account is higher than what was advertised on your website. My account shows 2.5 pips but the website says 1.2 pips for my account type. Could you please look into this?',
        timestamp: '2026-03-01T14:00:00Z',
      },
      {
        id: 'msg-3-2',
        sender: 'agent',
        senderName: 'James Wilson',
        content:
          'Subject: Re: Spread discrepancy on EUR/USD\n\nDear Sarah,\n\nThank you for bringing this to our attention. I have reviewed your account (ID: 90234) and can confirm that the spread should indeed be 1.2 pips for your Pro account tier. This appears to be a configuration issue on our end.\n\nI have escalated this to our technical team. You should see the corrected spread within 24 hours. I apologize for any inconvenience.\n\nBest regards,\nJames Wilson',
        timestamp: '2026-03-01T16:30:00Z',
      },
    ],
  },
  {
    id: 'conv-4',
    clientId: 'client-10',
    clientName: 'Kim Soo-jin',
    channel: 'phone',
    assignedTo: 'user-support-3',
    lastMessage: 'Call ended. Client confirmed withdrawal request was submitted successfully.',
    lastMessageTime: '2026-03-02T08:15:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-4-1',
        sender: 'client',
        senderName: 'Kim Soo-jin',
        content:
          'I submitted a withdrawal request 5 days ago but the funds have not arrived in my bank account yet.',
        timestamp: '2026-03-02T08:00:00Z',
      },
      {
        id: 'msg-4-2',
        sender: 'agent',
        senderName: 'Park Jihoon',
        content:
          'Let me check your withdrawal request. I can see the request for $5,000 USD submitted on February 25th. It was processed on our end on February 27th. International wire transfers typically take 3-5 business days.',
        timestamp: '2026-03-02T08:05:00Z',
      },
      {
        id: 'msg-4-3',
        sender: 'client',
        senderName: 'Kim Soo-jin',
        content: 'So it should arrive by tomorrow at the latest?',
        timestamp: '2026-03-02T08:08:00Z',
      },
      {
        id: 'msg-4-4',
        sender: 'agent',
        senderName: 'Park Jihoon',
        content:
          'Yes, by March 3rd at the latest. If you do not see it by end of business tomorrow, please contact us again and we will investigate with the bank directly.',
        timestamp: '2026-03-02T08:10:00Z',
      },
      {
        id: 'msg-4-5',
        sender: 'agent',
        senderName: 'Park Jihoon',
        content:
          'Call ended. Client confirmed withdrawal request was submitted successfully.',
        timestamp: '2026-03-02T08:15:00Z',
      },
    ],
  },
  {
    id: 'conv-5',
    clientId: 'client-11',
    clientName: 'Zhang Wei',
    channel: 'livechat',
    assignedTo: 'user-sales-2',
    lastMessage: 'Great, I will check the IB dashboard now. Thanks!',
    lastMessageTime: '2026-03-02T11:10:00Z',
    unreadCount: 2,
    messages: [
      {
        id: 'msg-5-1',
        sender: 'client',
        senderName: 'Zhang Wei',
        content:
          'Hi, I am an IB partner and I would like to know my current commission balance.',
        timestamp: '2026-03-02T10:50:00Z',
      },
      {
        id: 'msg-5-2',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'Hello Zhang Wei! Let me pull up your IB account. Your current pending commission is $2,340.50 for this month. You have 12 active sub-clients contributing to your earnings.',
        timestamp: '2026-03-02T10:55:00Z',
      },
      {
        id: 'msg-5-3',
        sender: 'client',
        senderName: 'Zhang Wei',
        content:
          'That is good to know. When will the commission be paid out?',
        timestamp: '2026-03-02T11:00:00Z',
      },
      {
        id: 'msg-5-4',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'Commissions are settled on the 5th of each month. So your February commissions will be processed on March 5th. You can track the real-time breakdown in the IB dashboard under the Commissions tab.',
        timestamp: '2026-03-02T11:05:00Z',
      },
      {
        id: 'msg-5-5',
        sender: 'client',
        senderName: 'Zhang Wei',
        content: 'Great, I will check the IB dashboard now. Thanks!',
        timestamp: '2026-03-02T11:10:00Z',
      },
    ],
  },
  {
    id: 'conv-6',
    clientId: 'client-12',
    clientName: 'Ahmed Al-Rashid',
    channel: 'whatsapp',
    assignedTo: 'user-sales-1',
    lastMessage: 'I have submitted the additional form. Please confirm receipt.',
    lastMessageTime: '2026-03-01T15:45:00Z',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-6-1',
        sender: 'client',
        senderName: 'Ahmed Al-Rashid',
        content:
          'Hello, I want to upgrade my account to the Islamic (swap-free) account type. How do I proceed?',
        timestamp: '2026-03-01T14:30:00Z',
      },
      {
        id: 'msg-6-2',
        sender: 'agent',
        senderName: 'James Wilson',
        content:
          'Hello Ahmed! To switch to an Islamic account, you will need to submit a Swap-Free Account Request form. I can send you the link right now. The conversion typically takes 1 business day once approved.',
        timestamp: '2026-03-01T14:35:00Z',
      },
      {
        id: 'msg-6-3',
        sender: 'client',
        senderName: 'Ahmed Al-Rashid',
        content: 'Yes, please send me the form.',
        timestamp: '2026-03-01T14:38:00Z',
      },
      {
        id: 'msg-6-4',
        sender: 'agent',
        senderName: 'James Wilson',
        content:
          'Here is the form link: [Swap-Free Request Form]. Please fill it out and submit. Also, please note that some instruments may have adjusted conditions under swap-free terms.',
        timestamp: '2026-03-01T14:42:00Z',
      },
      {
        id: 'msg-6-5',
        sender: 'client',
        senderName: 'Ahmed Al-Rashid',
        content: 'I have submitted the additional form. Please confirm receipt.',
        timestamp: '2026-03-01T15:45:00Z',
      },
    ],
  },
  {
    id: 'conv-7',
    clientId: 'client-13',
    clientName: 'Maria Garcia',
    channel: 'email',
    assignedTo: 'user-support-1',
    lastMessage:
      'Thank you Maria. I have reopened your ticket and assigned it to a senior analyst. You should hear back within 4 hours.',
    lastMessageTime: '2026-03-01T18:00:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-7-1',
        sender: 'client',
        senderName: 'Maria Garcia',
        content:
          'Subject: Urgent - Account locked after failed login attempts\n\nMy trading account has been locked. I tried to log in multiple times but it keeps saying invalid credentials. I have trades open and need access immediately. Account number: 78234.',
        timestamp: '2026-03-01T17:00:00Z',
      },
      {
        id: 'msg-7-2',
        sender: 'agent',
        senderName: 'Maria Santos',
        content:
          'Subject: Re: Urgent - Account locked after failed login attempts\n\nDear Maria,\n\nI understand the urgency. I have reviewed your account and can see that it was temporarily locked due to 5 consecutive failed login attempts. For your security, I have initiated a password reset. You should receive the reset link at your registered email within the next 5 minutes.\n\nRegarding your open trades, they remain active and protected by your existing stop-loss orders. Once you reset your password, you will have full access again.\n\nBest regards,\nMaria Santos\nSupport Team',
        timestamp: '2026-03-01T17:20:00Z',
      },
      {
        id: 'msg-7-3',
        sender: 'client',
        senderName: 'Maria Garcia',
        content:
          'Subject: Re: Re: Urgent - Account locked after failed login attempts\n\nI reset the password but the platform still shows "Account Suspended." This is a different error now. Please help, I am worried about my positions.',
        timestamp: '2026-03-01T17:45:00Z',
      },
      {
        id: 'msg-7-4',
        sender: 'agent',
        senderName: 'Maria Santos',
        content:
          'Subject: Re: Re: Re: Urgent - Account locked after failed login attempts\n\nThank you Maria. I have reopened your ticket and assigned it to a senior analyst. You should hear back within 4 hours. In the meantime, I can confirm your positions are safe - the "Suspended" status only affects login, not trade execution.',
        timestamp: '2026-03-01T18:00:00Z',
      },
    ],
  },
  {
    id: 'conv-8',
    clientId: 'client-14',
    clientName: 'Nguyen Van Minh',
    channel: 'livechat',
    assignedTo: 'user-sales-3',
    lastMessage: 'The leverage has been updated to 1:200. You can verify in your account settings.',
    lastMessageTime: '2026-03-02T07:30:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-8-1',
        sender: 'client',
        senderName: 'Nguyen Van Minh',
        content: 'Can I change my leverage from 1:100 to 1:200?',
        timestamp: '2026-03-02T07:15:00Z',
      },
      {
        id: 'msg-8-2',
        sender: 'agent',
        senderName: 'Yuki Tanaka',
        content:
          'Hi Minh! Yes, you can adjust your leverage. However, please note that higher leverage increases both potential profits and risks. Do you have any open positions currently?',
        timestamp: '2026-03-02T07:18:00Z',
      },
      {
        id: 'msg-8-3',
        sender: 'client',
        senderName: 'Nguyen Van Minh',
        content: 'No, I closed all positions yesterday.',
        timestamp: '2026-03-02T07:20:00Z',
      },
      {
        id: 'msg-8-4',
        sender: 'agent',
        senderName: 'Yuki Tanaka',
        content:
          'Perfect, since you have no open positions I can process this change immediately. Let me update it now.',
        timestamp: '2026-03-02T07:25:00Z',
      },
      {
        id: 'msg-8-5',
        sender: 'agent',
        senderName: 'Yuki Tanaka',
        content:
          'The leverage has been updated to 1:200. You can verify in your account settings.',
        timestamp: '2026-03-02T07:30:00Z',
      },
    ],
  },
  {
    id: 'conv-9',
    clientId: 'client-15',
    clientName: 'Liu Chen',
    channel: 'whatsapp',
    assignedTo: 'user-sales-2',
    lastMessage: 'Understood. I will check the promotions page. Thank you for the info!',
    lastMessageTime: '2026-03-01T13:20:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-9-1',
        sender: 'client',
        senderName: 'Liu Chen',
        content: 'Hi, do you have any deposit bonus promotions running right now?',
        timestamp: '2026-03-01T13:00:00Z',
      },
      {
        id: 'msg-9-2',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'Hello Liu Chen! Yes, we currently have a 20% deposit bonus for deposits over $500 USD. The promotion runs until March 31st. Would you like me to send you the details?',
        timestamp: '2026-03-01T13:05:00Z',
      },
      {
        id: 'msg-9-3',
        sender: 'client',
        senderName: 'Liu Chen',
        content: 'Is there a maximum bonus amount?',
        timestamp: '2026-03-01T13:10:00Z',
      },
      {
        id: 'msg-9-4',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'The maximum bonus is $2,000 USD. So a deposit of $10,000 would give you the full $2,000 bonus. The bonus is credited immediately and has a 5-lot trading volume requirement before withdrawal.',
        timestamp: '2026-03-01T13:15:00Z',
      },
      {
        id: 'msg-9-5',
        sender: 'client',
        senderName: 'Liu Chen',
        content:
          'Understood. I will check the promotions page. Thank you for the info!',
        timestamp: '2026-03-01T13:20:00Z',
      },
    ],
  },
  {
    id: 'conv-10',
    clientId: 'client-16',
    clientName: 'John Smith',
    channel: 'phone',
    assignedTo: 'user-support-1',
    lastMessage:
      'Call resolved. Client was informed about margin requirements for gold trading. No further action needed.',
    lastMessageTime: '2026-03-01T20:00:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-10-1',
        sender: 'client',
        senderName: 'John Smith',
        content:
          'I received a margin call notification but I do not understand why. My balance should be sufficient.',
        timestamp: '2026-03-01T19:40:00Z',
      },
      {
        id: 'msg-10-2',
        sender: 'agent',
        senderName: 'Maria Santos',
        content:
          'Let me review your positions. I can see you have 2 lots of XAUUSD open. Gold has moved significantly today, which increased your margin requirement. Your free margin dropped below the maintenance level.',
        timestamp: '2026-03-01T19:45:00Z',
      },
      {
        id: 'msg-10-3',
        sender: 'client',
        senderName: 'John Smith',
        content:
          'What do I need to do to avoid being stopped out?',
        timestamp: '2026-03-01T19:48:00Z',
      },
      {
        id: 'msg-10-4',
        sender: 'agent',
        senderName: 'Maria Santos',
        content:
          'You have two options: deposit additional funds to increase your margin, or reduce your position size. I would recommend depositing at least $1,500 to bring your margin level back above 150%. Alternatively, you could close one of the two gold lots.',
        timestamp: '2026-03-01T19:52:00Z',
      },
      {
        id: 'msg-10-5',
        sender: 'agent',
        senderName: 'Maria Santos',
        content:
          'Call resolved. Client was informed about margin requirements for gold trading. No further action needed.',
        timestamp: '2026-03-01T20:00:00Z',
      },
    ],
  },
  {
    id: 'conv-11',
    clientId: 'client-17',
    clientName: 'Lee Min-ho',
    channel: 'livechat',
    assignedTo: 'user-support-3',
    lastMessage: 'Thanks for clarifying! I will submit the MT4 to MT5 migration request now.',
    lastMessageTime: '2026-03-02T06:45:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-11-1',
        sender: 'client',
        senderName: 'Lee Min-ho',
        content: 'Is it possible to transfer my account from MT4 to MT5?',
        timestamp: '2026-03-02T06:20:00Z',
      },
      {
        id: 'msg-11-2',
        sender: 'agent',
        senderName: 'Park Jihoon',
        content:
          'Hello Lee Min-ho! Yes, we do support MT4 to MT5 migration. However, please note that your trade history will be archived and open positions need to be closed before migration. Would you like to proceed?',
        timestamp: '2026-03-02T06:25:00Z',
      },
      {
        id: 'msg-11-3',
        sender: 'client',
        senderName: 'Lee Min-ho',
        content:
          'Will my account settings like leverage and account type remain the same?',
        timestamp: '2026-03-02T06:30:00Z',
      },
      {
        id: 'msg-11-4',
        sender: 'agent',
        senderName: 'Park Jihoon',
        content:
          'Yes, your leverage, account type, and balance will all be carried over. The only change is the trading platform. You will also get access to additional instruments available exclusively on MT5.',
        timestamp: '2026-03-02T06:35:00Z',
      },
      {
        id: 'msg-11-5',
        sender: 'client',
        senderName: 'Lee Min-ho',
        content:
          'Thanks for clarifying! I will submit the MT4 to MT5 migration request now.',
        timestamp: '2026-03-02T06:45:00Z',
      },
    ],
  },
  {
    id: 'conv-12',
    clientId: 'client-18',
    clientName: 'Priya Patel',
    channel: 'email',
    assignedTo: 'user-support-2',
    lastMessage:
      'Dear Priya, we have verified and corrected the commission discrepancy. The adjusted amount of $127.40 has been credited to your IB wallet.',
    lastMessageTime: '2026-02-28T17:30:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-12-1',
        sender: 'client',
        senderName: 'Priya Patel',
        content:
          'Subject: Commission discrepancy for February\n\nHi Support Team,\n\nI noticed my IB commission for the week of Feb 16-22 seems lower than expected. My sub-clients traded over 50 lots but I only received commission for around 35 lots. Could you please review this?\n\nIB Account: IB-4521\n\nRegards,\nPriya',
        timestamp: '2026-02-28T14:00:00Z',
      },
      {
        id: 'msg-12-2',
        sender: 'agent',
        senderName: 'Chen Mei',
        content:
          'Subject: Re: Commission discrepancy for February\n\nDear Priya,\n\nThank you for reporting this. I have reviewed the trading records for your sub-clients during the specified period. It appears that trades from two of your sub-clients (accounts ending in 3342 and 7891) were not correctly attributed to your IB tree due to a system sync delay.\n\nWe have verified and corrected the commission discrepancy. The adjusted amount of $127.40 has been credited to your IB wallet. You should see it reflected within 24 hours.\n\nPlease do not hesitate to reach out if you have further questions.\n\nBest regards,\nChen Mei\nIB Support',
        timestamp: '2026-02-28T17:30:00Z',
      },
    ],
  },
  {
    id: 'conv-13',
    clientId: 'client-19',
    clientName: 'David Brown',
    channel: 'livechat',
    assignedTo: 'user-sales-1',
    lastMessage: 'Perfect, I will go ahead and open the additional account.',
    lastMessageTime: '2026-03-02T12:00:00Z',
    unreadCount: 3,
    messages: [
      {
        id: 'msg-13-1',
        sender: 'client',
        senderName: 'David Brown',
        content: 'I would like to open a second trading account for a different strategy. Is that possible?',
        timestamp: '2026-03-02T11:40:00Z',
      },
      {
        id: 'msg-13-2',
        sender: 'agent',
        senderName: 'James Wilson',
        content:
          'Absolutely, David! You can open multiple trading accounts under the same profile. Each account can have different settings like leverage, base currency, and account type. Would you like a Standard or Pro account?',
        timestamp: '2026-03-02T11:43:00Z',
      },
      {
        id: 'msg-13-3',
        sender: 'client',
        senderName: 'David Brown',
        content:
          'I would prefer a Standard account with EUR base currency and 1:100 leverage.',
        timestamp: '2026-03-02T11:48:00Z',
      },
      {
        id: 'msg-13-4',
        sender: 'agent',
        senderName: 'James Wilson',
        content:
          'Great choice. You can create this directly from your Client Area under "Open Additional Account." Since you are already verified, no additional KYC is required. The account will be ready within minutes.',
        timestamp: '2026-03-02T11:55:00Z',
      },
      {
        id: 'msg-13-5',
        sender: 'client',
        senderName: 'David Brown',
        content: 'Perfect, I will go ahead and open the additional account.',
        timestamp: '2026-03-02T12:00:00Z',
      },
    ],
  },
  {
    id: 'conv-14',
    clientId: 'client-20',
    clientName: 'Sato Kenji',
    channel: 'whatsapp',
    assignedTo: 'user-sales-3',
    lastMessage: 'Noted. I will wait for the MT5 platform update tonight.',
    lastMessageTime: '2026-03-02T04:30:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-14-1',
        sender: 'client',
        senderName: 'Sato Kenji',
        content: 'The MT5 platform keeps disconnecting. Is there a known issue?',
        timestamp: '2026-03-02T04:00:00Z',
      },
      {
        id: 'msg-14-2',
        sender: 'agent',
        senderName: 'Yuki Tanaka',
        content:
          'Hello Sato-san. Yes, we are aware of intermittent connectivity issues affecting some MT5 users in the Asia region. Our technical team is working on a fix that will be deployed tonight during the maintenance window (23:00-23:30 JST).',
        timestamp: '2026-03-02T04:10:00Z',
      },
      {
        id: 'msg-14-3',
        sender: 'client',
        senderName: 'Sato Kenji',
        content: 'Will my pending orders be affected?',
        timestamp: '2026-03-02T04:15:00Z',
      },
      {
        id: 'msg-14-4',
        sender: 'agent',
        senderName: 'Yuki Tanaka',
        content:
          'No, your pending orders remain active on our servers regardless of your platform connectivity. They will execute at the specified price levels. The disconnection only affects the visual interface.',
        timestamp: '2026-03-02T04:22:00Z',
      },
      {
        id: 'msg-14-5',
        sender: 'client',
        senderName: 'Sato Kenji',
        content: 'Noted. I will wait for the MT5 platform update tonight.',
        timestamp: '2026-03-02T04:30:00Z',
      },
    ],
  },
  {
    id: 'conv-15',
    clientId: 'client-21',
    clientName: 'Chen Jiayi',
    channel: 'phone',
    assignedTo: 'user-sales-2',
    lastMessage:
      'Call summary: Client inquired about VIP upgrade requirements. Explained $50,000 minimum balance and 100 lots/month trading volume criteria.',
    lastMessageTime: '2026-03-01T10:30:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-15-1',
        sender: 'client',
        senderName: 'Chen Jiayi',
        content:
          'What are the requirements to upgrade to VIP status? I have been trading actively and want to know if I qualify.',
        timestamp: '2026-03-01T10:10:00Z',
      },
      {
        id: 'msg-15-2',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'Great question! To qualify for VIP status, you need a minimum account balance of $50,000 and an average monthly trading volume of 100 lots over the past 3 months. Let me check your current stats.',
        timestamp: '2026-03-01T10:15:00Z',
      },
      {
        id: 'msg-15-3',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'I can see your balance is currently $42,000 and your average monthly volume is 85 lots. You are close! With about $8,000 more in deposits and a slight increase in trading activity, you would qualify.',
        timestamp: '2026-03-01T10:20:00Z',
      },
      {
        id: 'msg-15-4',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'Call summary: Client inquired about VIP upgrade requirements. Explained $50,000 minimum balance and 100 lots/month trading volume criteria.',
        timestamp: '2026-03-01T10:30:00Z',
      },
    ],
  },
  {
    id: 'conv-16',
    clientId: 'client-22',
    clientName: 'Thomas Mueller',
    channel: 'email',
    assignedTo: 'user-support-1',
    lastMessage:
      'Dear Thomas, your tax documents for the 2025 fiscal year have been generated and are available for download in your Client Area under Documents > Tax Statements.',
    lastMessageTime: '2026-02-28T12:00:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-16-1',
        sender: 'client',
        senderName: 'Thomas Mueller',
        content:
          'Subject: Tax document request\n\nHello,\n\nCould you please provide me with a summary of all my trading activity for the 2025 tax year? I need it for my annual tax filing. I would need realized P&L, swap charges, and commission details broken down by month.\n\nThank you,\nThomas Mueller',
        timestamp: '2026-02-28T09:00:00Z',
      },
      {
        id: 'msg-16-2',
        sender: 'agent',
        senderName: 'Maria Santos',
        content:
          'Subject: Re: Tax document request\n\nDear Thomas,\n\nYour tax documents for the 2025 fiscal year have been generated and are available for download in your Client Area under Documents > Tax Statements. The report includes:\n\n- Monthly realized P&L breakdown\n- Swap/rollover charges by instrument\n- Commission details per trade\n- Annual summary totals\n\nThe documents are in PDF format. If you need them in a different format (CSV/Excel), please let us know.\n\nBest regards,\nMaria Santos\nClient Support',
        timestamp: '2026-02-28T12:00:00Z',
      },
    ],
  },
  {
    id: 'conv-17',
    clientId: 'client-23',
    clientName: 'Huang Mei-ling',
    channel: 'livechat',
    assignedTo: 'user-support-2',
    lastMessage: 'Got it, I will upload the updated company registration documents shortly.',
    lastMessageTime: '2026-03-02T09:50:00Z',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-17-1',
        sender: 'client',
        senderName: 'Huang Mei-ling',
        content:
          'Hello, my corporate account KYC was rejected. The reason stated was "insufficient company documentation." What exactly do you need?',
        timestamp: '2026-03-02T09:20:00Z',
      },
      {
        id: 'msg-17-2',
        sender: 'agent',
        senderName: 'Chen Mei',
        content:
          'Hello Huang Mei-ling. For corporate accounts, we require: (1) Certificate of Incorporation, (2) Memorandum and Articles of Association, (3) Register of Directors and Shareholders, (4) Proof of registered business address, and (5) ID documents for all directors and beneficial owners with 25%+ ownership.',
        timestamp: '2026-03-02T09:28:00Z',
      },
      {
        id: 'msg-17-3',
        sender: 'client',
        senderName: 'Huang Mei-ling',
        content:
          'I see. I think I only submitted the Certificate of Incorporation and the director IDs. I will prepare the rest.',
        timestamp: '2026-03-02T09:35:00Z',
      },
      {
        id: 'msg-17-4',
        sender: 'agent',
        senderName: 'Chen Mei',
        content:
          'That would explain the rejection. Once you upload all the required documents, the review process typically takes 3-5 business days for corporate accounts. Please upload them through the Corporate Documents section in your client portal.',
        timestamp: '2026-03-02T09:42:00Z',
      },
      {
        id: 'msg-17-5',
        sender: 'client',
        senderName: 'Huang Mei-ling',
        content:
          'Got it, I will upload the updated company registration documents shortly.',
        timestamp: '2026-03-02T09:50:00Z',
      },
    ],
  },
  {
    id: 'conv-18',
    clientId: 'client-24',
    clientName: 'Robert Taylor',
    channel: 'whatsapp',
    assignedTo: 'user-sales-1',
    lastMessage: 'Thanks James, I will review the IB agreement and get back to you.',
    lastMessageTime: '2026-03-01T21:15:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-18-1',
        sender: 'client',
        senderName: 'Robert Taylor',
        content:
          'Hi, I am interested in becoming an Introducing Broker. I have a large network of traders in the UK. What are the requirements?',
        timestamp: '2026-03-01T20:30:00Z',
      },
      {
        id: 'msg-18-2',
        sender: 'agent',
        senderName: 'James Wilson',
        content:
          'Hello Robert! That is great to hear. To become an IB partner, you will need to: (1) Have an active trading account with us, (2) Submit an IB application form, (3) Provide proof of your marketing/referral capabilities. Our standard commission is $7-12 per lot depending on the instrument.',
        timestamp: '2026-03-01T20:40:00Z',
      },
      {
        id: 'msg-18-3',
        sender: 'client',
        senderName: 'Robert Taylor',
        content:
          'That sounds reasonable. What about sub-IB arrangements? Some of my contacts also run their own networks.',
        timestamp: '2026-03-01T20:50:00Z',
      },
      {
        id: 'msg-18-4',
        sender: 'agent',
        senderName: 'James Wilson',
        content:
          'We do support multi-tier IB structures. You would earn a commission override on your sub-IBs\' client trades as well. I can send you the full IB Partnership Agreement that outlines the commission tiers and sub-IB terms. Shall I?',
        timestamp: '2026-03-01T21:00:00Z',
      },
      {
        id: 'msg-18-5',
        sender: 'client',
        senderName: 'Robert Taylor',
        content:
          'Yes please. Also, do you have any marketing materials I can use?',
        timestamp: '2026-03-01T21:05:00Z',
      },
      {
        id: 'msg-18-6',
        sender: 'agent',
        senderName: 'James Wilson',
        content:
          'Absolutely! Once you are approved as an IB, you will get access to our Marketing Portal with banners, landing pages, referral links, and tracking tools. I am sending the IB Agreement to your email now.',
        timestamp: '2026-03-01T21:10:00Z',
      },
      {
        id: 'msg-18-7',
        sender: 'client',
        senderName: 'Robert Taylor',
        content:
          'Thanks James, I will review the IB agreement and get back to you.',
        timestamp: '2026-03-01T21:15:00Z',
      },
    ],
  },
  {
    id: 'conv-19',
    clientId: 'client-25',
    clientName: 'Anna Kowalski',
    channel: 'livechat',
    assignedTo: 'user-support-3',
    lastMessage: 'Thank you, the copy trading connection is working now!',
    lastMessageTime: '2026-03-02T13:30:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-19-1',
        sender: 'client',
        senderName: 'Anna Kowalski',
        content:
          'Hi, I am trying to set up copy trading but I cannot find the Signal Provider I want to follow. Their name is "ForexMaster_Pro."',
        timestamp: '2026-03-02T13:00:00Z',
      },
      {
        id: 'msg-19-2',
        sender: 'agent',
        senderName: 'Park Jihoon',
        content:
          'Hello Anna! Let me look that up. I can see the Signal Provider "ForexMaster_Pro" is available but they recently updated their settings to only accept followers with a minimum balance of $1,000. Could you confirm your current account balance?',
        timestamp: '2026-03-02T13:08:00Z',
      },
      {
        id: 'msg-19-3',
        sender: 'client',
        senderName: 'Anna Kowalski',
        content: 'My balance is $2,500 so that should not be an issue.',
        timestamp: '2026-03-02T13:12:00Z',
      },
      {
        id: 'msg-19-4',
        sender: 'agent',
        senderName: 'Park Jihoon',
        content:
          'You are right, the balance is fine. The issue seems to be that your account type is Standard, but the Signal Provider requires followers to have an ECN account type. You can either open a new ECN account or I can help you convert your existing one.',
        timestamp: '2026-03-02T13:18:00Z',
      },
      {
        id: 'msg-19-5',
        sender: 'client',
        senderName: 'Anna Kowalski',
        content:
          'I would prefer to open a new ECN account and keep my Standard one as well.',
        timestamp: '2026-03-02T13:22:00Z',
      },
      {
        id: 'msg-19-6',
        sender: 'agent',
        senderName: 'Park Jihoon',
        content:
          'Done! I have created a new ECN account for you. You can transfer funds between your accounts internally. Once you deposit into the ECN account, search for "ForexMaster_Pro" in the copy trading section and click "Follow."',
        timestamp: '2026-03-02T13:26:00Z',
      },
      {
        id: 'msg-19-7',
        sender: 'client',
        senderName: 'Anna Kowalski',
        content:
          'Thank you, the copy trading connection is working now!',
        timestamp: '2026-03-02T13:30:00Z',
      },
    ],
  },
  {
    id: 'conv-20',
    clientId: 'client-7',
    clientName: 'Wang Xiaoming',
    channel: 'phone',
    assignedTo: 'user-sales-2',
    lastMessage:
      'Call summary: Client confirmed receipt of bank transfer deposit ($5,000). Assisted with placing first trade on USD/CNH.',
    lastMessageTime: '2026-02-28T09:30:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-20-1',
        sender: 'client',
        senderName: 'Wang Xiaoming',
        content:
          'My deposit arrived but I am not sure how to start trading. Can you walk me through it?',
        timestamp: '2026-02-28T09:00:00Z',
      },
      {
        id: 'msg-20-2',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'Of course! First, open the MT5 platform and click on "Market Watch" on the left side. You can add instruments by right-clicking and selecting "Show All." What would you like to trade?',
        timestamp: '2026-02-28T09:05:00Z',
      },
      {
        id: 'msg-20-3',
        sender: 'client',
        senderName: 'Wang Xiaoming',
        content: 'I am interested in USD/CNH. How do I open a position?',
        timestamp: '2026-02-28T09:10:00Z',
      },
      {
        id: 'msg-20-4',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'Find USD/CNH in the Market Watch, double-click it to open the order window. Set your lot size (I recommend starting with 0.1 lots for your first trade), choose Buy or Sell, and optionally set Stop Loss and Take Profit levels. Then click the order button.',
        timestamp: '2026-02-28T09:18:00Z',
      },
      {
        id: 'msg-20-5',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'Call summary: Client confirmed receipt of bank transfer deposit ($5,000). Assisted with placing first trade on USD/CNH.',
        timestamp: '2026-02-28T09:30:00Z',
      },
    ],
  },
  {
    id: 'conv-21',
    clientId: 'client-10',
    clientName: 'Kim Soo-jin',
    channel: 'email',
    assignedTo: 'user-support-3',
    lastMessage:
      'Dear Kim Soo-jin, your account currency has been changed from USD to KRW as requested. Please note that all existing balances have been converted at the current exchange rate.',
    lastMessageTime: '2026-02-28T15:00:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-21-1',
        sender: 'client',
        senderName: 'Kim Soo-jin',
        content:
          'Subject: Account base currency change request\n\nHello,\n\nI would like to change my account base currency from USD to KRW. Is this possible without opening a new account?\n\nThank you,\nKim Soo-jin',
        timestamp: '2026-02-28T11:00:00Z',
      },
      {
        id: 'msg-21-2',
        sender: 'agent',
        senderName: 'Park Jihoon',
        content:
          'Subject: Re: Account base currency change request\n\nDear Kim Soo-jin,\n\nYes, we can process this change for you. Please note the following:\n- All open positions must be closed before the currency change\n- Your existing balance will be converted at the current market rate\n- The process takes approximately 1 business day\n\nSince you currently have no open positions, I have processed the change immediately. Your account currency has been changed from USD to KRW as requested. Please note that all existing balances have been converted at the current exchange rate.\n\nBest regards,\nPark Jihoon',
        timestamp: '2026-02-28T15:00:00Z',
      },
    ],
  },
  {
    id: 'conv-22',
    clientId: 'client-15',
    clientName: 'Liu Chen',
    channel: 'livechat',
    assignedTo: 'user-sales-2',
    lastMessage: 'OK, I will deposit $2,000 to qualify for the bonus. Thanks for the help!',
    lastMessageTime: '2026-03-02T14:20:00Z',
    unreadCount: 2,
    messages: [
      {
        id: 'msg-22-1',
        sender: 'client',
        senderName: 'Liu Chen',
        content:
          'Hi again. I decided to take advantage of the deposit bonus. I want to deposit via WeChat Pay. Is that available?',
        timestamp: '2026-03-02T14:00:00Z',
      },
      {
        id: 'msg-22-2',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'Welcome back, Liu Chen! Unfortunately, WeChat Pay is not available for deposits at the moment. However, we do support Alipay, UnionPay, and bank wire transfer for Chinese clients. Would any of these work for you?',
        timestamp: '2026-03-02T14:05:00Z',
      },
      {
        id: 'msg-22-3',
        sender: 'client',
        senderName: 'Liu Chen',
        content: 'Alipay works for me. What is the minimum deposit for the bonus?',
        timestamp: '2026-03-02T14:10:00Z',
      },
      {
        id: 'msg-22-4',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'The minimum deposit to qualify for the 20% bonus is $500 USD. With Alipay, the deposit is processed instantly and the bonus is credited automatically. Remember, the maximum bonus is $2,000.',
        timestamp: '2026-03-02T14:15:00Z',
      },
      {
        id: 'msg-22-5',
        sender: 'client',
        senderName: 'Liu Chen',
        content:
          'OK, I will deposit $2,000 to qualify for the bonus. Thanks for the help!',
        timestamp: '2026-03-02T14:20:00Z',
      },
    ],
  },
  {
    id: 'conv-23',
    clientId: 'client-19',
    clientName: 'David Brown',
    channel: 'phone',
    assignedTo: 'user-sales-1',
    lastMessage:
      'Call summary: Discussed portfolio diversification strategies. Client interested in adding commodity CFDs. Sent follow-up email with educational materials.',
    lastMessageTime: '2026-02-28T20:30:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-23-1',
        sender: 'client',
        senderName: 'David Brown',
        content:
          'I have been trading only forex pairs. I want to diversify into commodities. What do you offer?',
        timestamp: '2026-02-28T20:00:00Z',
      },
      {
        id: 'msg-23-2',
        sender: 'agent',
        senderName: 'James Wilson',
        content:
          'We offer CFDs on gold, silver, crude oil (WTI and Brent), natural gas, and several agricultural commodities. Spreads start from 0.3 pips for gold and margins are as low as 5% depending on your account type.',
        timestamp: '2026-02-28T20:08:00Z',
      },
      {
        id: 'msg-23-3',
        sender: 'client',
        senderName: 'David Brown',
        content: 'What about trading hours for commodities?',
        timestamp: '2026-02-28T20:15:00Z',
      },
      {
        id: 'msg-23-4',
        sender: 'agent',
        senderName: 'James Wilson',
        content:
          'Gold and silver trade nearly 24 hours from Monday to Friday. Crude oil follows similar hours with a short daily break. I will send you a detailed trading conditions sheet via email after this call.',
        timestamp: '2026-02-28T20:22:00Z',
      },
      {
        id: 'msg-23-5',
        sender: 'agent',
        senderName: 'James Wilson',
        content:
          'Call summary: Discussed portfolio diversification strategies. Client interested in adding commodity CFDs. Sent follow-up email with educational materials.',
        timestamp: '2026-02-28T20:30:00Z',
      },
    ],
  },
  {
    id: 'conv-24',
    clientId: 'client-16',
    clientName: 'John Smith',
    channel: 'whatsapp',
    assignedTo: 'user-support-1',
    lastMessage: 'Received, I will enable 2FA now. Thanks for the security tip!',
    lastMessageTime: '2026-03-02T15:10:00Z',
    unreadCount: 1,
    messages: [
      {
        id: 'msg-24-1',
        sender: 'agent',
        senderName: 'Maria Santos',
        content:
          'Hi John, this is a friendly reminder from our security team. We noticed your account does not have Two-Factor Authentication (2FA) enabled. We strongly recommend enabling it for additional account security.',
        timestamp: '2026-03-02T15:00:00Z',
      },
      {
        id: 'msg-24-2',
        sender: 'client',
        senderName: 'John Smith',
        content: 'Oh, I did not realize it was not set up. How do I enable it?',
        timestamp: '2026-03-02T15:03:00Z',
      },
      {
        id: 'msg-24-3',
        sender: 'agent',
        senderName: 'Maria Santos',
        content:
          'Go to Settings > Security > Two-Factor Authentication in your Client Area. You can use Google Authenticator or receive codes via SMS. I recommend the authenticator app for better security.',
        timestamp: '2026-03-02T15:07:00Z',
      },
      {
        id: 'msg-24-4',
        sender: 'client',
        senderName: 'John Smith',
        content: 'Received, I will enable 2FA now. Thanks for the security tip!',
        timestamp: '2026-03-02T15:10:00Z',
      },
    ],
  },
  {
    id: 'conv-25',
    clientId: 'client-11',
    clientName: 'Zhang Wei',
    channel: 'email',
    assignedTo: 'user-sales-2',
    lastMessage:
      'Dear Zhang Wei, your updated IB marketing materials (Chinese language pack) have been uploaded to your IB portal. The new referral links with campaign tracking are also ready.',
    lastMessageTime: '2026-03-01T11:00:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg-25-1',
        sender: 'client',
        senderName: 'Zhang Wei',
        content:
          'Subject: Request for updated marketing materials\n\nHi Li Wei,\n\nI need updated marketing banners and landing pages in Chinese for my IB campaign. The current materials are from last year and some of the spreads mentioned are outdated. Also, I would like to set up campaign-specific referral links for tracking.\n\nThanks,\nZhang Wei',
        timestamp: '2026-03-01T09:00:00Z',
      },
      {
        id: 'msg-25-2',
        sender: 'agent',
        senderName: 'Li Wei',
        content:
          'Subject: Re: Request for updated marketing materials\n\nDear Zhang Wei,\n\nThank you for reaching out. I have coordinated with our marketing department and your updated IB marketing materials (Chinese language pack) have been uploaded to your IB portal. This includes:\n\n- 6 new banner designs (300x250, 728x90, 160x600 sizes)\n- Updated landing page with current spread information\n- Chinese-language educational content for client acquisition\n\nThe new referral links with campaign tracking are also ready. You can find them under IB Portal > Marketing > Campaign Links. Each link has a unique tracking ID for performance analysis.\n\nBest regards,\nLi Wei',
        timestamp: '2026-03-01T11:00:00Z',
      },
    ],
  },
]
