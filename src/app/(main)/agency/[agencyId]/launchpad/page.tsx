import { Button } from "@/components/ui/button";
import { getAgencyDetails } from "@/lib/queries";
import { CheckCircle, Ghost } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function LaunchPad({
  params,
}: {
  params: { agencyId: string };
}) {
  const agency = await getAgencyDetails(params.agencyId);

  const itemsRequired = [
    agency?.name,
    agency?.companyEmail,
    agency?.companyPhone,
    agency?.whiteLabel,
    agency?.address,
    agency?.city,
    agency?.state,
    agency?.zipCode,
    agency?.country,
  ];

  const allCompleted = itemsRequired.every(Boolean);

  return (
    <div className="max-w-screen-sm mx-auto py-12 space-y-6 p-6">
      <div>
        <h2 className="text-2xl">
          <span className="text-3xl">🙏</span> Lets ge started
        </h2>
        <div className="text-muted-foreground">
          Follow the steps below to get your account setup.
        </div>
      </div>

      <div className="text-sm space-y-5">
        <div className="flex items-center justify-between p-3 gap-6 rounded-md">
          <div className="flex items-center gap-2">
            <Image
              src={"/appstore.png"}
              alt={"App store logo"}
              height={80}
              width={80}
            />
            <p>Save the website as a shortcut on your mobile device.</p>
          </div>
          <Button>Start</Button>
        </div>

        <div className="flex items-center  p-3 gap-6 rounded-md">
          <div className="flex items-center gap-2">
            <Image
              src={"/stripelogo.png"}
              alt={"Stripe logo"}
              height={80}
              width={80}
            />
            <p>
              Connect your stripe account to accept apyments and see your
              dashboard.
            </p>
          </div>
          <Button>Start</Button>
        </div>

        <div className="flex items-center justify-between p-3 gap-6 rounded-md">
          <div className="flex items-center gap-2">
            <Image
              src={agency?.agencyLogo!}
              alt={"Agency logo"}
              height={80}
              width={80}
            />
            <p>Fill in your business details.</p>
          </div>
          {allCompleted ? (
            <Button variant={"ghost"}>
              <CheckCircle />
            </Button>
          ) : (
            <Link href={`/agency/${agency?.id}/settings`}>
              <Button>Complete all details</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
