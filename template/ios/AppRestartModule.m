// AppRestartModule.m
// Exposes AppRestart native module to React Native on iOS.
// Uses RCTTriggerReloadCommandListeners to reload the JS bundle,
// which re-mounts the entire React tree — sufficient for RTL/LTR changes.

#import <React/RCTBridgeModule.h>
#import <React/RCTReloadCommand.h>

@interface AppRestart : NSObject <RCTBridgeModule>
@end

@implementation AppRestart

RCT_EXPORT_MODULE()

RCT_EXPORT_METHOD(restart) {
    dispatch_async(dispatch_get_main_queue(), ^{
        RCTTriggerReloadCommandListeners(@"Language direction change");
    });
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

@end
