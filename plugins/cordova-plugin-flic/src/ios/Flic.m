//
//  Flic
//
//  Created by Maxim Dukhanov <m.dukhanov@gmail.com>
//

#import "Flic.h"
#import <Cordova/CDVAvailability.h>
#import <fliclib/fliclib.h>


@interface Flic () <SCLFlicManagerDelegate, SCLFlicButtonDelegate>
@end

@implementation Flic

static NSString * const pluginNotInitializedMessage = @"flic is not initialized";
static NSString * const TAG = @"[TAF Flic] ";
static NSString * const BUTTON_EVENT_SINGLECLICK = @"singleClick";
static NSString * const BUTTON_EVENT_DOUBLECLICK = @"doubleClick";
static NSString * const BUTTON_EVENT_HOLD = @"hold";
@synthesize onButtonClickCallbackId;

- (void)pluginInitialize
{
    [self log:@"pluginInitialize"];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleOpenURL:) name:@"flicApp" object:nil];
}

- (void) init:(CDVInvokedUrlCommand*)command
{
    [self log:@"init"];
    
	NSDictionary *config = [command.arguments objectAtIndex:0];
	NSString* APP_ID = [config objectForKey:@"appId"];
	NSString* APP_SECRET = [config objectForKey:@"appSecret"];
	
    self.flicManager = [SCLFlicManager configureWithDelegate:self defaultButtonDelegate:self appID:APP_ID appSecret:APP_SECRET backgroundExecution:NO];
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:[self knownButtons]];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId ];
}

- (void) getKnownButtons:(CDVInvokedUrlCommand*)command
{
    [self log:@"getKnownButtons"];
    
    CDVPluginResult* result;
    // in case plugin is not initialized
    if (self.flicManager == nil) {
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:pluginNotInitializedMessage];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsArray:[self knownButtons]];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void) flicManagerDidRestoreState:(SCLFlicManager * _Nonnull) manager{
    [self log:@"flicManagerDidRestoreState"];
    
    // setup trigger behavior for already grabbed buttons
    NSArray * kButtons = [[SCLFlicManager sharedManager].knownButtons allValues];
    for (SCLFlicButton *button in kButtons) {
        button.triggerBehavior = SCLFlicButtonTriggerBehaviorClickAndDoubleClickAndHold;
    }
}

- (void) grabButton:(CDVInvokedUrlCommand*)command
{
    [self log:@"grabButton"];
    
    CDVPluginResult* result;
    // in case plugin is not initialized
    if (self.flicManager == nil) {
        [self log:@"flicManager is null"];
        result = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:pluginNotInitializedMessage];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        return;
    }
    NSString *FlicUrlScheme = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"FlicUrlScheme"];
	[[SCLFlicManager sharedManager] grabFlicFromFlicAppWithCallbackUrlScheme:FlicUrlScheme];
	result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
	[self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void) waitForButtonEvent:(CDVInvokedUrlCommand*)command
{
    // do not use it
    return;
}

- (void) triggerButtonEvent:(CDVInvokedUrlCommand*)command
{
    // do not use it
    return;
}

- (void) onButtonClick:(CDVInvokedUrlCommand *)command
{
    self.onButtonClickCallbackId = command.callbackId;
    return;
}

// button received
- (void)flicManager:(SCLFlicManager *)manager didGrabFlicButton:(SCLFlicButton *)button withError:(NSError *)error;
{
    if(error)
    {
        NSLog(@"Could not grab: %@", error);
    }
    
    if(button != nil){
        button.triggerBehavior = SCLFlicButtonTriggerBehaviorClickAndDoubleClickAndHold;
    }
    
    [self log:@"Grabbed button"];
}

// button was unregistered
- (void)flicManager:(SCLFlicManager *)manager didForgetButton:(NSUUID *)buttonIdentifier error:(NSError *)error;
{
    [self log:@"Unregistered button"];
}

// button was clicked
- (void)flicButton:(SCLFlicButton *)button didReceiveButtonClick:(BOOL)queued age:(NSInteger)age
{
    [self log:@"didReceiveButtonClick"];
    
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self getButtonEventObject:BUTTON_EVENT_SINGLECLICK button:button]];
    [result setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:result callbackId:self.onButtonClickCallbackId];
}

// button was double clicked
- (void)flicButton:(SCLFlicButton *)button didReceiveButtonDoubleClick:(BOOL)queued age:(NSInteger)age
{
    [self log:@"didReceiveButtonDoubleClick"];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self getButtonEventObject:BUTTON_EVENT_DOUBLECLICK button:button]];
    [result setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:result callbackId:self.onButtonClickCallbackId];
}

// button was hold
- (void)flicButton:(SCLFlicButton *)button didReceiveButtonHold:(BOOL)queued age:(NSInteger)age
{
    [self log:@"didReceiveButtonHold"];
    CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:[self getButtonEventObject:BUTTON_EVENT_HOLD button:button]];
    [result setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:result callbackId:self.onButtonClickCallbackId];
}

- (NSDictionary*)getButtonEventObject:(NSString *)event button:(SCLFlicButton *)button
{
    NSDictionary *buttonResult = [self getButtonJsonObject:button];
    NSDictionary *result = @{
                   @"event": event,
                   @"button": buttonResult
                };
    
    return result;
}

- (NSMutableArray*)knownButtons
{
    NSMutableArray *result = [[NSMutableArray alloc] init];
    
    NSLog(@"get knownButtons");
    
    NSArray * kButtons = [[SCLFlicManager sharedManager].knownButtons allValues];
    for (SCLFlicButton *button in kButtons) {
        NSDictionary* b = [self getButtonJsonObject:button];
        [result addObject:b];
    }
    
    return result;
}

- (NSDictionary*)getButtonJsonObject:(SCLFlicButton *)button
{
    //NSString *colorString1 = [CIColor colorWithCGColor:button.color.CGColor].stringRepresentation;
    //NSLog(@"colorString1: %@", colorString1);
    
    //NSString *colorString = [self hexStringForColor:button.color];
    //NSLog(@"colorString: %@", colorString);
    
    NSDictionary *result = @{
        @"buttonId": [button.buttonIdentifier UUIDString],
        @"name": button.userAssignedName,
        @"color": @"white",
        @"connectionState": [self connectionStateForButton:button]
        };
    
    return result;
}

- (NSString *)connectionStateForButton:(SCLFlicButton *)button {
    if(button == nil)
    {
        return @"";
    }
    
    if (button.connectionState == SCLFlicButtonConnectionStateConnected) {
        return @"Connected";
    }else if (button.connectionState == SCLFlicButtonConnectionStateConnecting) {
        return @"Connecting";
    }else if (button.connectionState == SCLFlicButtonConnectionStateDisconnected) {
        return @"Disconnected";
    }else if (button.connectionState == SCLFlicButtonConnectionStateDisconnecting) {
        return @"Disconnecting";
    }
    
    return @"unknown";
}

- (NSString *)hexStringForColor:(UIColor *)color {
    const CGFloat *components = CGColorGetComponents(color.CGColor);
    CGFloat r = components[0];
    CGFloat g = components[1];
    CGFloat b = components[2];
    NSString *hexString=[NSString stringWithFormat:@"%02X%02X%02X", (int)(r * 255), (int)(g * 255), (int)(b * 255)];
    return hexString;
}

- (void)handleOpenURL:(NSNotification*)notification
{
    NSURL* url = [notification object];
    
    if ([url isKindOfClass:[NSURL class]]) {
        [[SCLFlicManager sharedManager] handleOpenURL:url];
        
        NSLog(@"handleOpenURL %@", url);
    }
}

-(void)log:(NSString *)text
{
    NSLog(@"%@%@", TAG, text);
}

@end

