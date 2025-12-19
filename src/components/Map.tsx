import { useAnimations, useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useEffect, useRef } from "react";
import type { Group } from "three";

interface MapProps {
    model: string;
    scale?: number;
    position?: [number, number, number];
    [key: string]: any;
}

export const Map = ({ model, ...props }: MapProps) => {
    const { scene, animations } = useGLTF(model) as any;
    const group = useRef<Group>(null);
    const { actions } = useAnimations(animations, group);
    useEffect(() => {
        scene.traverse((child: any) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
    }, [scene]);

    useEffect(() => {
        if (actions && animations.length > 0) {
            actions[animations[0].name]?.play();
        }
    }, [actions, animations]);

    return (
        <group>
            <RigidBody type="fixed" colliders="trimesh">
                <primitive object={scene} {...props} ref={group} />
            </RigidBody>
        </group>
    );
};
