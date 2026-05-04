export const SAMPLE_QUICK_ACTIONS = [
  { id: '1', title: 'New Post',      icon: 'plus-circle-outline', color: '#6366F1' },
  { id: '2', title: 'Messages',      icon: 'message-outline',     color: '#EC4899' },
  { id: '3', title: 'Analytics',     icon: 'chart-line',          color: '#F59E0B' },
  { id: '4', title: 'Settings',      icon: 'cog-outline',         color: '#10B981' },
];

export const SAMPLE_STATS = [
  { id: '1', label: 'Total Users',   value: '12,430', trend: '+8%',  trendUp: true  },
  { id: '2', label: 'Revenue',       value: '$4,290', trend: '+12%', trendUp: true  },
  { id: '3', label: 'Active Today',  value: '1,203',  trend: '-3%',  trendUp: false },
  { id: '4', label: 'Conversions',   value: '94%',    trend: '+2%',  trendUp: true  },
];

export const SAMPLE_ACTIVITIES = [
  {
    id: '1',
    user: 'Ahmed Hassan',
    avatar: null,
    initials: 'AH',
    action: 'created a new post',
    time: '2 min ago',
    icon: 'file-document-outline',
    iconColor: '#6366F1',
    unread: true,
  },
  {
    id: '2',
    user: 'Sara Ali',
    avatar: null,
    initials: 'SA',
    action: 'commented on your update',
    time: '15 min ago',
    icon: 'comment-outline',
    iconColor: '#EC4899',
    unread: true,
  },
  {
    id: '3',
    user: 'Mohamed Youssef',
    avatar: null,
    initials: 'MY',
    action: 'shared your profile',
    time: '1 hour ago',
    icon: 'share-outline',
    iconColor: '#F59E0B',
    unread: false,
  },
  {
    id: '4',
    user: 'Layla Nour',
    avatar: null,
    initials: 'LN',
    action: 'followed you',
    time: '3 hours ago',
    icon: 'account-plus-outline',
    iconColor: '#10B981',
    unread: false,
  },
  {
    id: '5',
    user: 'Omar Khalid',
    avatar: null,
    initials: 'OK',
    action: 'liked your post',
    time: 'Yesterday',
    icon: 'heart-outline',
    iconColor: '#EF4444',
    unread: false,
  },
];

export const SETTINGS_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'profile',        label: 'Edit Profile',        icon: 'account-edit-outline',   screen: 'EditProfile' },
      { id: 'password',       label: 'Change Password',     icon: 'lock-outline',            screen: 'ChangePassword' },
      { id: 'notifications',  label: 'Notifications',       icon: 'bell-outline',            screen: 'Notifications' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'theme',    label: 'Appearance',   icon: 'palette-outline',      screen: null, action: 'theme' },
      { id: 'language', label: 'Language',     icon: 'translate',            screen: null, action: 'language' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help',    label: 'Help Center',    icon: 'help-circle-outline',   url: 'https://yourapp.com/help' },
      { id: 'privacy', label: 'Privacy Policy', icon: 'shield-outline',        url: 'https://yourapp.com/privacy' },
      { id: 'terms',   label: 'Terms of Use',   icon: 'file-document-outline', url: 'https://yourapp.com/terms' },
      { id: 'rate',    label: 'Rate the App',   icon: 'star-outline',          screen: null, action: 'rate' },
    ],
  },
];

export const SAMPLE_PROFILE_STATS = [
  { label: 'Posts',      value: '48'  },
  { label: 'Followers',  value: '1.2K' },
  { label: 'Following',  value: '320' },
];

export const SAMPLE_NOTIFICATIONS = [
  { id: '1', title: 'New message',       body: 'You have a new message from Ahmed', time: '5m', read: false },
  { id: '2', title: 'Post liked',        body: 'Sara liked your recent post',       time: '1h', read: false },
  { id: '3', title: 'Welcome!',          body: 'Thanks for joining {{APP_NAME_DISPLAY}}',    time: '2d', read: true  },
];
