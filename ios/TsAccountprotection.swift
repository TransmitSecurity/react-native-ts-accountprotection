import AccountProtection

@objc(TsAccountprotection)
class TsAccountprotection: NSObject {
    
    private let kTag = "TSAccountprotection"
    
    @objc(initialize:baseUrl:withResolver:withRejecter:)
    func initialize(
        _ clientId: String,
        baseUrl: String,
        resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
            
            guard !clientId.isEmpty, !baseUrl.isEmpty else {
                reject("Invalid params provided to .initialize", nil, nil)
                return
            }
            
            runBlockOnMain {
                TSAccountProtection.initialize(baseUrl: baseUrl, clientId: clientId)
                resolve(true)
            }
        }
    
    @objc(setUserId:withResolver:withRejecter:)
    func setUserId(userId: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        guard !userId.isEmpty else {
            reject("Invalid params provided to .setUserId", nil, nil)
            return
        }
        
        runBlockOnMain {
            TSAccountProtection.setUserId(userId)
            resolve(true)
        }
    }
    
    @objc(triggerAction:options:withResolver:withRejecter:)
    func triggerAction(action: String, options: NSDictionary?, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        
        runBlockOnMain { [weak self] in
            
            var transactionOptions: AccountProtection.TSActionEventOptions? = nil
            if let options = options {
                transactionOptions = self?.convertTransactionOptions(options)
                if transactionOptions == nil {
                    reject("Invalid options provided to triggerAction", nil, nil)
                    return
                }
            }
            
            TSAccountProtection.triggerAction(action, options: transactionOptions) { results in
                self?.runBlockOnMain {
                    switch results {
                    case .success(let response):
                        let actionToken: String = response.actionToken
                        resolve(["results": "success", "actionToken": actionToken])
                    case .failure(let error):
                        switch error {
                        case .disabled:
                            resolve(["results": "error", "error": "disabled"])
                        case .connectionError:
                            resolve(["results": "error", "error": "connectionError"])
                        case .internalError:
                            resolve(["results": "error", "error": "internalError"])
                        case .notSupportedActionError:
                            resolve(["results": "error", "error": "notSupportedActionError"])
                        @unknown default:
                            resolve(["results": "error", "error": "@unknown"])
                        }
                    }
                }
            }
        }
    }
    
    // MARK: - Helpers
    
    private func convertTransactionOptions(_ options: NSDictionary) -> AccountProtection.TSActionEventOptions? {
        guard doMandatoryOptionsExist(options) else { return nil }
        
        let correlationId = options["correlationId"] as? String
        let claimUserId = options["claimUserId"] as? String
        let referenceUserId = options["referenceUserId"] as? String
        let transactionData = convertTransactionDataFromOptions(options)
        
        let options = TSActionEventOptions(
            correlationId: correlationId,
            claimUserId: claimUserId,
            referenceUserId: referenceUserId,
            transactionData: transactionData
        )
        
        return options
    }
    
    private func doMandatoryOptionsExist(_ options: NSDictionary) -> Bool {
        guard let data = options["transactionData"] as? [String: Any] else {
            return true // the entire object is really optional
        }
        
        let amount = data["amount"] as? Double
        let currency = data["currency"] as? String
        
        return amount != nil && currency != nil // the only two mandatory items
    }
    
    private func convertTransactionDataFromOptions(_ options: NSDictionary) -> TSTransactionData? {
        guard let data = options["transactionData"] as? [String: Any] else {
            return nil
        }
        
        guard let amount = data["amount"] as? Double,
              let currency = data["currency"] as? String else {
            return nil
        }
        
        let reason = data["reason"] as? String
        let transactionDate = data["transactionDate"] as? Int
        
        var payer: TSTransactionData.Payer?
        var payee: TSTransactionData.Payee?
        
        if let payerData = data["payer"] as? [String: String] {
            payer = TSTransactionData.Payer(
                name: payerData["name"],
                branchIdentifier: payerData["branchIdentifier"],
                accountNumber: payerData["accountNumber"]
            )
        }
        
        if let payeeData = data["payee"] as? [String: String] {
            payee = TSTransactionData.Payee(
                name: payeeData["name"],
                bankIdentifier: payeeData["bankIdentifier"],
                branchIdentifier: payeeData["branchIdentifier"],
                accountNumber: payeeData["accountNumber"]
            )
        }

        return TSTransactionData(
            amount: amount,
            currency: currency,
            reason: reason,
            transactionDate: (transactionDate != nil) ? Int64(transactionDate!) : nil,
            payer: payer,
            payee: payee
        )
    }
    
    // MARK: - Threading
    
    private func runBlockOnMain(_ block: @escaping () -> Void) {
        DispatchQueue.main.async {
            block()
        }
    }
}
