# App Update Functionality

This document describes the app update functionality implemented in the SQA Earning app.

## Features

### 1. App Update Screen (`src/screens/AppUpdateScreen.tsx`)
- **Version Checking**: Automatically checks for available updates from the server
- **Download Progress**: Real-time download progress with visual progress bar
- **Update Information**: Displays version details, release notes, and file size
- **Required vs Optional Updates**: Handles both mandatory and optional updates
- **Platform Support**: Supports both Android and iOS platforms
- **Permission Handling**: Platform-specific permission handling for downloads

### 2. Platform-Specific Features

#### Android
- **Storage Permission**: Requests `WRITE_EXTERNAL_STORAGE` permission (optional)
- **Download Location**: Files saved to Downloads folder
- **Permission Handling**: Graceful fallback if permission denied
- **File Access**: Direct file access for installation

#### iOS
- **No Storage Permission**: iOS doesn't require explicit storage permissions
- **Download Location**: Files saved to app's Documents directory
- **Sandboxed Access**: Secure file access within app sandbox
- **Installation**: Redirects to App Store for updates

### 3. API Endpoints

#### Check for Updates (`/api/mobile/app/update/check`)
- **GET**: Checks for available updates
- **POST**: Logs update check analytics
- **Parameters**: `version`, `platform`, `build`
- **Response**: Update information including version, download URL, release notes

#### Download Update (`/api/mobile/app/update/download`)
- **GET**: Provides download URL and file information
- **POST**: Logs download analytics
- **Parameters**: `version`, `platform`, `build`
- **Response**: Download URL, file size, checksum

### 4. Navigation Integration
- Added to main navigation stack as `AppUpdate` screen
- Accessible from About screen via "Check for Updates" button
- Added to sidebar menu for easy access

## Usage

### For Users
1. Navigate to **About** screen → **Check for Updates**
2. Or use sidebar menu → **App Update**
3. Review update information and release notes
4. Click **Download Update** to start download
5. Install the downloaded update

### For Developers
1. Update version information in API endpoints
2. Upload new APK/IPA files to server
3. Update release notes and changelog
4. Test download functionality

## Platform-Specific Implementation

### Android Implementation
```typescript
// Permission handling for Android
if (Platform.OS === 'android') {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    {
      title: 'Storage Permission',
      message: 'App needs access to storage to download the update',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    }
  );
  
  if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    // Show warning but allow download to continue
    Alert.alert('Permission Notice', 'Storage permission is recommended...');
  }
}
```

### iOS Implementation
```typescript
// iOS doesn't require explicit storage permissions
if (Platform.OS === 'ios') {
  console.log('iOS platform detected - no storage permission required');
  // Files are downloaded to app's documents directory
}
```

## API Response Format

### Update Check Response
```json
{
  "success": true,
  "result": {
    "version": "1.2.0",
    "buildNumber": "120",
    "downloadUrl": "https://example.com/app-update.apk",
    "fileSize": "25.6 MB",
    "releaseNotes": ["New features", "Bug fixes"],
    "isRequired": false,
    "minVersion": "1.0.0",
    "releaseDate": "2024-01-15",
    "isUpdateAvailable": true,
    "isUpdateRequired": false,
    "currentVersion": "1.0.0",
    "platform": "android",
    "buildNumber": "1",
    "lastChecked": "2024-01-15T10:30:00Z"
  }
}
```

### Download Response
```json
{
  "success": true,
  "result": {
    "downloadUrl": "https://example.com/app-update.apk",
    "filename": "sqa-earning-v1.2.0-build120.apk",
    "fileSize": "25.6 MB",
    "checksum": "sha256:abc123def456...",
    "version": "1.2.0",
    "platform": "android",
    "buildNumber": "120",
    "downloadStarted": "2024-01-15T10:30:00Z"
  }
}
```

## Security Features
- Version validation
- Platform-specific downloads
- Checksum verification
- Download analytics tracking
- Platform-specific permission handling

## Error Handling
- Network error fallbacks
- Permission denial handling (Android)
- Download failure recovery
- API timeout handling
- Mock data fallbacks for testing
- Platform-specific error messages

## Platform Differences

| Feature | Android | iOS |
|---------|---------|-----|
| Storage Permission | Optional WRITE_EXTERNAL_STORAGE | Not required |
| Download Location | Downloads folder | App Documents |
| File Access | Direct access | Sandboxed |
| Installation | Direct APK install | App Store redirect |
| Permission UI | Native Android dialog | Not applicable |

## Future Enhancements
- Real file streaming
- Background download support
- Auto-update functionality
- Delta updates for smaller downloads
- Update scheduling
- Rollback functionality
- Platform-specific optimization