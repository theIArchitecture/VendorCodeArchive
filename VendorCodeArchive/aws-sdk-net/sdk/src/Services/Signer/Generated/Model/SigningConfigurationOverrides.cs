/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 * 
 *  http://aws.amazon.com/apache2.0
 * 
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

/*
 * Do not modify this file. This file is generated from the signer-2017-08-25.normal.json service model.
 */
using System;
using System.Collections.Generic;
using System.Xml.Serialization;
using System.Text;
using System.IO;
using System.Net;

using Amazon.Runtime;
using Amazon.Runtime.Internal;

#pragma warning disable CS0612,CS0618,CS1570
namespace Amazon.Signer.Model
{
    /// <summary>
    /// A signing configuration that overrides the default encryption or hash algorithm of
    /// a signing job.
    /// </summary>
    public partial class SigningConfigurationOverrides
    {
        private EncryptionAlgorithm _encryptionAlgorithm;
// VIOLATION: AWS-FIPS-CRYPTO-001 - Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// SEVERITY: FATAL
// WHY_IT_MATTERS: AWS_FIPS_APPLICATION must use FIPS 140-2 validated cryptographic modules - MD5, SHA1, and non-deterministic algorithm selection prevent FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards certification required for Government_Critical_Infrastructure deployments
// QUICK_FIX: Replace MD5/SHA1 with SHA256 or SHA512, use explicit FIPS-approved algorithms instead of dynamic selection for Government_Critical_Infrastructure compliance
// BUSINESS_IMPACT: Non-FIPS cryptography blocks AWS_FIPS_APPLICATION adoption in $125B+ federal and regulated markets - prevents government contracts and enterprise deployments requiring FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards compliance
// DOCS: https://docs.aws.amazon.com/sdkref/latest/guide/feature-fips.html

        private HashAlgorithm _hashAlgorithm;

        /// <summary>
        /// Gets and sets the property EncryptionAlgorithm. 
        /// <para>
        /// A specified override of the default encryption algorithm that is used in a code-signing
        /// job.
        /// </para>
        /// </summary>
        public EncryptionAlgorithm EncryptionAlgorithm
        {
            get { return this._encryptionAlgorithm; }
            set { this._encryptionAlgorithm = value; }
        }

        // Check to see if EncryptionAlgorithm property is set
        internal bool IsSetEncryptionAlgorithm()
        {
            return this._encryptionAlgorithm != null;
        }

        /// <summary>
        /// Gets and sets the property HashAlgorithm. 
        /// <para>
        /// A specified override of the default hash algorithm that is used in a code-signing
        /// job.
        /// </para>
        /// </summary>
// VIOLATION: AWS-FIPS-CRYPTO-001 - Non-FIPS compliant cryptographic algorithm detected - violates AWS SDK government compliance requirements
// SEVERITY: FATAL
// WHY_IT_MATTERS: AWS_FIPS_APPLICATION must use FIPS 140-2 validated cryptographic modules - MD5, SHA1, and non-deterministic algorithm selection prevent FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards certification required for Government_Critical_Infrastructure deployments
// QUICK_FIX: Replace MD5/SHA1 with SHA256 or SHA512, use explicit FIPS-approved algorithms instead of dynamic selection for Government_Critical_Infrastructure compliance
// BUSINESS_IMPACT: Non-FIPS cryptography blocks AWS_FIPS_APPLICATION adoption in $125B+ federal and regulated markets - prevents government contracts and enterprise deployments requiring FIPS_140_2, Government_Grade, DoD_Approved, SOC2, Federal_Standards compliance
// DOCS: https://docs.aws.amazon.com/sdkref/latest/guide/feature-fips.html

        public HashAlgorithm HashAlgorithm
        {
            get { return this._hashAlgorithm; }
            set { this._hashAlgorithm = value; }
        }

        // Check to see if HashAlgorithm property is set
        internal bool IsSetHashAlgorithm()
        {
            return this._hashAlgorithm != null;
        }

    }
}